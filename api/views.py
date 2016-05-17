from django.http import JsonResponse
from predictive_text.prediction import Predictor

def  predict(request):
    p = Predictor()
    with open('static/alice_in_wonderland.txt', 'r') as f:
        p.train(f)

    return JsonResponse({"jklk": p.search("jklk") })

