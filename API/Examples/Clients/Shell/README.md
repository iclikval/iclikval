# Using curl
curl -v -H 'Accept: application/json' -H 'Authorization: Bearer your_access_token_here' http://iclikval.riken.jp/api/annotation 

# Using httpie
http GET http://iclikval.riken.jp/api/annotation 'Authorization: Bearer your_access_token_here'
