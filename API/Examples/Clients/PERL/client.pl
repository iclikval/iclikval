use LWP::UserAgent;

# iCLiKVAL API Endpoint
my $endpoint = 'http://iclikval.riken.jp/api'; # Replace with real endpoint
# API Access Token
my $token = 'xxxxxxxxxxxxxxxxxxxxxxxxx'; # Replace with real access token

# Headers
my $headers  = [
    'Accept'        => 'application/json' ,
    'Content-Type'  => 'application/json' ,
    'Authorization' => 'Bearer '. $token
];

# Request
my $method   = 'GET';
my $resource = 'annotation';
my $uri      = $endpoint .'/'. $resource;
my $request  = HTTP::Request->new($method, $uri, $headers);

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
~     
