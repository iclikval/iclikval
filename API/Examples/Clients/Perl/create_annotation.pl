use LWP::UserAgent;

# iCLiKVAL API Endpoint
my $endpoint = 'http://api.iclikval.riken.jp';

# API Access Token
my $token = 'your_access_token';

# Headers
my $headers  = [
    'Accept'        => 'application/json' ,
    'Content-Type'  => 'application/json' ,
    'Authorization' => 'Bearer '. $token
];

# Request
my $method   = 'POST';
my $resource = 'annotation';
my $uri      = $endpoint .'/'. $resource;
my $request  = HTTP::Request->new($method, $uri, $headers);


my $data = '{"key": "test key1", "value": "test value2", "language": "eng", "media": "media_id"}';

$request->content($data);

# User agent
my $browser  = LWP::UserAgent->new;
my $response = $browser->request($request);


# Response
if ($response->is_success) {
    print $response->content, "\n";
} else {
    print $response->status_line, "\n";
    print $response->content, "\n";
}
