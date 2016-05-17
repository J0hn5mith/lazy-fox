from django.http import JsonResponse

def  predict(request):
    return JsonResponse({"String": "Hello World"})

