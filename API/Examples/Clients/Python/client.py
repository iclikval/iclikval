import requests, json

# iCLiKVAL API endpoint 
endpoint = "http://iclikval.riken.jp/api"
resource = "annotation"
uri      = endpoint + "/" + resource

# Headers
headers  = {
    'User-Agent'    : 'MyApp/1.0',
    'Accept'        : 'application/json',
    'Authorization' : 'Bearer xxxxxxxxxxxxxxxxxxxx'  # Replace with real access token
}

response = requests.get(uri, headers=headers)

print response.json()
