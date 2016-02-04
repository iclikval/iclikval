require 'net/http'

# iCLiKVAL API endpoint
endpoint = 'http://api.iclikval.riken.jp'
resource = 'annotation'
uri      = endpoint + '/' + resource
url      = URI.parse(uri)

request  = Net::HTTP::Get.new(url.to_s)
request['User-Agent']    = 'MyApp/0.1'
request['Accept']        = 'application/json'
request['Authorization'] = 'Bearer xxxxxxxxxxxxxxxx' # Replace with real access token

response = Net::HTTP.start(url.host, url.port) {|http|
  http.request(request)
}

case response
when Net::HTTPSuccess
  puts response.body
else
  puts response.value
end
