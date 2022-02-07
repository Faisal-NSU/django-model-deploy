from marshal import dumps
from django.shortcuts import render
import torchvision
from django.http.response import JsonResponse
import base64
from PIL import Image
import io
from torchvision import transforms
import torch
from torchvision import models
from PIL import Image
import pandas as pd
import json

csv = 'https://raw.githubusercontent.com/Tylersuard/COVID-Mat2Vec/master/imagenet_classes.csv'

def preprocess_image(image):
    transform = transforms.Compose([            #[1]
    transforms.Resize(256),                    #[2]
    transforms.CenterCrop(224),                #[3]
    transforms.ToTensor(),                     #[4]
    transforms.Normalize(                      #[5]
    mean=[0.485, 0.456, 0.406],                #[6]
    std=[0.229, 0.224, 0.225]                  #[7]
    )])
    
    img = transform(image)
    img = torch.unsqueeze(img, 0)

    return img


def predict(request):
    if request.method == 'POST':
        model = models.mobilenet_v3_small(pretrained=True)
        encoded = request.POST["image"]
        decoded = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(decoded)).convert('RGB')
        processed_image = preprocess_image(image)
        model.eval()
        prediction = model(processed_image)
        _, indices = torch.sort(prediction, descending=True)
        percentage = torch.nn.functional.softmax(prediction, dim=1)[0] * 100

        df = pd.read_csv(csv)
        
        listtt = [(str(df.iloc[idx.item()][0]), str(percentage[idx.item()].item())) for idx in indices[0][:5]]
        cat, perc = [] , []
        for i,j in listtt:
            cat.append(i)
            perc.append(j)

        dataDic ={'cat':cat,
                  'perc':perc}

        return JsonResponse(dataDic, safe=False)
        

def index(request):  

    small = torchvision.models.mobilenet_v3_small(pretrained=True)

    #print(small)

    user = ''
    context = {'user': user}
    return render(request, 'polls/index.html', context)