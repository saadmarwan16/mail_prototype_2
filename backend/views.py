import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.decorators import parser_classes
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser

from .models import User, Email


@api_view()
def get_user_email(request):
    return Response({
        "email": request.user.email
    }, status=200)


@api_view()
def get_csrf_token(request):
    return Response({
        "csrf_token": get_token(request), 
    }, status=200)


@api_view()
def index(request):
    return Response({
        "message": request.user.is_authenticated
    }, status=400)


@login_required
@api_view(['POST'])
@parser_classes([JSONParser])
def compose(request):

    # Check recipient emails
    data = request.data
    emails = [email.strip() for email in data.get("recipients").split(",")]
    if emails == [""]:
        return Response({
            "error": "At least one recipient required."
        }, status=400)

    # Convert email addresses to users
    recipients = []
    for email in emails:
        try:
            user = User.objects.get(email=email)
            recipients.append(user)
        except User.DoesNotExist:
            return Response({
                "error": f"User with email {email} does not exist."
            }, status=400)

    # Get contents of email
    subject = data.get("subject", "")
    body = data.get("body", "")

    # Create one email for each recipient, plus sender
    users = set()
    users.add(request.user)
    users.update(recipients)
    for user in users:
        email = Email(
            user=user,
            sender=request.user,
            subject=subject,
            body=body,
            read=user == request.user
        )
        email.save()
        for recipient in recipients:
            email.recipients.add(recipient)
        email.save()

    return Response({"message": "Successful"}, status=201)


@login_required
@api_view()
def mailbox(request, mailbox):

    # Filter emails returned based on mailbox
    if mailbox == "inbox":
        emails = Email.objects.filter(
            user=request.user, recipients=request.user, archived=False, trashed=False
        )
    elif mailbox == "sent":
        emails = Email.objects.filter(
            user=request.user, sender=request.user, trashed=False
        )
    elif mailbox == "archive":
        emails = Email.objects.filter(
            user=request.user, recipients=request.user, archived=True
        )
    elif mailbox == "trash":
        emails = Email.objects.filter(
            user=request.user, trashed=True
        )
    else:
        return Response({"error": "Invalid mailbox."}, status=400)

    # Return emails in reverse chronologial order
    emails = emails.order_by("-timestamp").all()
    return Response([email.serialize() for email in emails])


@login_required
@api_view(['GET', 'PUT'])
@parser_classes([JSONParser])
def email(request, email_id):

    # Query for requested email
    try:
        email = Email.objects.get(user=request.user, pk=email_id)
    except Email.DoesNotExist:
        return Response({"error": "Email not found."}, status=404)

    # Return email contents
    if request.method == "GET":
        return Response(email.serialize())

    # Update whether email is read or should be archived
    elif request.method == "PUT":
        data = request.data
        if data.get("read") is not None:
            email.read = data["read"]
        if data.get("archived") is not None:
            email.archived = data["archived"]
        if data.get("trashed") is not None:
            email.trashed = data["trashed"]
        email.save()
        return HttpResponse(status=204)

    # Email must be via GET or PUT
    else:
        return Response({
            "error": "GET or PUT request required."
        }, status=400)


@api_view(['POST'])
@parser_classes([JSONParser])
def login_view(request):

    # Attempt to sign user in
    user = authenticate(request, username=request.data.get("email"), password=request.data.get("password"))

    # Check if authentication successful
    if user is not None:
        login(request, user)
        return Response({
            "message": "Successful"
        }, status=200)
    else:
        return Response({
            "error": "Invalid email and/or password"
        }, status=400)


@api_view(['POST'])
@parser_classes([JSONParser])
def register(request):
    email = request.data.get("email")

    # Ensure password matches confirmation
    password = request.data.get("password")
    confirmation = request.data.get("confirmation")
    if password != confirmation:
        return Response({
            "error": "Passwords must match"
        }, status=400)

    # Attempt to create new user
    try:
        user = User.objects.create_user(email, email, password)
        user.save()
    except IntegrityError:
        return Response({
            "error": "Email address already taken"
        }, status=400)

    login(request, user)
    return Response({
        "message": "Successful"
    }, status=200)


@login_required
@api_view()
# @parser_classes([JSONParser])
def logout_view(request):
    logout(request)
    return Response({
        "message": "Successful"
    }, status=200)


# def register(request):
#     if request.method == "POST":
#         email = request.POST["email"]

#         # Ensure password matches confirmation
#         password = request.POST["password"]
#         confirmation = request.POST["confirmation"]
#         if password != confirmation:
#             return render(request, "mail/register.html", {
#                 "message": "Passwords must match."
#             })

#         # Attempt to create new user
#         try:
#             user = User.objects.create_user(email, email, password)
#             user.save()
#         except IntegrityError as e:
#             print(e)
#             return render(request, "mail/register.html", {
#                 "message": "Email address already taken."
#             })
#         login(request, user)
#         return HttpResponseRedirect(reverse("index"))
#     else:
#         return render(request, "mail/register.html")

# def index(request):

#     return render(request, "mail/inbox.html")

#     # # Authenticated users view their inbox
#     # if request.user.is_authenticated:
#     #     return render(request, "mail/inbox.html")

#     # # Everyone else is prompted to sign in
#     # else:
#     #     return HttpResponseRedirect(reverse("login"))

# def logout_view(request):
#     logout(request)
#     return HttpResponseRedirect(reverse("index"))

# def login_view(request):
#     if request.method == "POST":

#         # Attempt to sign user in
#         email = request.POST["email"]
#         password = request.POST["password"]
#         user = authenticate(request, username=email, password=password)

#         # Check if authentication successful
#         if user is not None:
#             login(request, user)
#             return HttpResponseRedirect(reverse("index"))
#         else:
#             return render(request, "mail/login.html", {
#                 "message": "Invalid email and/or password."
#             })
#     else:
#         return render(request, "mail/login.html")


# @csrf_exempt
# @login_required
# def compose(request):

#     # Composing a new email must be via POST
#     if request.method != "POST":
#         return JsonResponse({"error": "POST request required."}, status=400)

#     # Check recipient emails
#     data = json.loads(request.body)
#     emails = [email.strip() for email in data.get("recipients").split(",")]
#     if emails == [""]:
#         return JsonResponse({
#             "error": "At least one recipient required."
#         }, status=400)

#     # Convert email addresses to users
#     recipients = []
#     for email in emails:
#         try:
#             user = User.objects.get(email=email)
#             recipients.append(user)
#         except User.DoesNotExist:
#             return JsonResponse({
#                 "error": f"User with email {email} does not exist."
#             }, status=400)

#     # Get contents of email
#     subject = data.get("subject", "")
#     body = data.get("body", "")

#     # Create one email for each recipient, plus sender
#     users = set()
#     users.add(request.user)
#     users.update(recipients)
#     for user in users:
#         email = Email(
#             user=user,
#             sender=request.user,
#             subject=subject,
#             body=body,
#             read=user == request.user
#         )
#         email.save()
#         for recipient in recipients:
#             email.recipients.add(recipient)
#         email.save()

#     return JsonResponse({"message": "Email sent successfully."}, status=201)


# @login_required
# def mailbox(request, mailbox):

#     # Filter emails returned based on mailbox
#     if mailbox == "inbox":
#         emails = Email.objects.filter(
#             user=request.user, recipients=request.user, archived=False, trashed=False
#         )
#     elif mailbox == "sent":
#         emails = Email.objects.filter(
#             user=request.user, sender=request.user, trashed=False
#         )
#     elif mailbox == "archive":
#         emails = Email.objects.filter(
#             user=request.user, recipients=request.user, archived=True
#         )
#     elif mailbox == "trash":
#         emails = Email.objects.filter(
#             user=request.user, trashed=True
#         )
#     else:
#         return JsonResponse({"error": "Invalid mailbox."}, status=400)

#     # Return emails in reverse chronologial order
#     emails = emails.order_by("-timestamp").all()
#     return JsonResponse([email.serialize() for email in emails], safe=False)


# @csrf_exempt
# @login_required
# def email(request, email_id):

#     # Query for requested email
#     try:
#         email = Email.objects.get(user=request.user, pk=email_id)
#     except Email.DoesNotExist:
#         return JsonResponse({"error": "Email not found."}, status=404)

#     # Return email contents
#     if request.method == "GET":
#         return JsonResponse(email.serialize())

#     # Update whether email is read or should be archived
#     elif request.method == "PUT":
#         data = json.loads(request.body)
#         if data.get("read") is not None:
#             email.read = data["read"]
#         if data.get("archived") is not None:
#             email.archived = data["archived"]
#         if data.get("trashed") is not None:
#             email.trashed = data["trashed"]
#         email.save()
#         return HttpResponse(status=204)

#     # Email must be via GET or PUT
#     else:
#         return JsonResponse({
#             "error": "GET or PUT request required."
#         }, status=400)


# @login_required
# def mailbox(request, mailbox):

#     # Filter emails returned based on mailbox
#     if mailbox == "inbox":
#         emails = Email.objects.filter(
#             user=request.user, recipients=request.user, archived=False, trashed=False
#         )
#     elif mailbox == "sent":
#         emails = Email.objects.filter(
#             user=request.user, sender=request.user, trashed=False
#         )
#     elif mailbox == "archive":
#         emails = Email.objects.filter(
#             user=request.user, recipients=request.user, archived=True
#         )
#     elif mailbox == "trash":
#         emails = Email.objects.filter(
#             user=request.user, trashed=True
#         )
#     else:
#         return JsonResponse({"error": "Invalid mailbox."}, status=400)

#     # Return emails in reverse chronologial order
#     emails = emails.order_by("-timestamp").all()
#     return JsonResponse([email.serialize() for email in emails], safe=False)