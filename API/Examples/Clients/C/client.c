#include <stdio.h>
#include <curl/curl.h>

int main(void)
{
  CURL *curl;
  CURLcode response;
  char *url = "http://iclikval.riken.jp/api/annotation";
  struct curl_slist *headers = NULL;

  headers = curl_slist_append(headers,"Accept: application/json");
  headers = curl_slist_append(headers,"User-Agent: MyApp/1.0");
  /* Replace the access token below with your own */
  headers = curl_slist_append(headers,"Authorization: Bearer your_own_access_token");

  curl = curl_easy_init();

  if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER , headers);
    response = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
  }

  return 0;
}
