from django.http import JsonResponse
from predictive_text.prediction import Predictor
import json
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def  predict(request):
    p = Predictor()

    with open('static/alice_in_wonderland.txt', 'r') as f:
        p.train(f)

    json_data = json.loads(request.body.decode('utf-8'))
    sequence = json_data['sequence']
    response = []
    return JsonResponse({
        "sequence": sequence,
        "suggestions": p.search(sequence) 
        })

