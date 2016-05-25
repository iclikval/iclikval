The API provides data in HAL (Hypermedia Application Language) format. Data in HAL format are just arrays of embedded resources (in this case, annotations). It includes a self relational link and pagination links - first, last, next, and prev. Also, it includes the total number of items (annotations) and page counts to easiliy be integrated with any pagination workflow.

If you are not using pagination, please ignore relational links and metadata related to paginations. To work only on annotation data just get the ["_embedded"]["annotation"] which is a collection of annotations (it will be always a colection even if there is only single annotation data) and iterate over that collection using your choice of programming language.

Sample annotation:

```
{
    "_embedded": {
        "annotation": [
            {
                "id": "541bedfce362651a577b2403",
                "key": "keyword",
                "relationship": "is",
                "value": "viral metagenomics",
                "language": "eng",
                "source": "system",
                "voteDownCount": 0,
                "voteUpCount": 0,
                "media": {
                    "media_id": "541bedfce362651a577b23f9",
                    "title": "What is for dinner? Viral metagenomics of US store bought beef, pork, and chicken.",
                    "type": "Journal Article"
                },
                "reviewer": {
                    "gravatar": "79f3a39cd59645510149cf7668b566c9",
                    "name": "ICLiKVAL System User",
                    "organization": "RIKEN",
                    "username": "iclikval"
                },
                "created_at": "2014-09-19T17:49:00+09:00",
                "updated_at": "2014-09-19T17:49:00+09:00",
                "_links": {
                    "self": {
                        "href": "http://api.iclikval.riken.jp/annotation/541bedfce362651a577b2403"
                    }
                },
            }
        ]
    },
    "_links": {
        "first": {
            "href": "http://api.iclikval.riken.jp/annotation"
        },
        "last": {
            "href": "http://api.iclikval.riken.jp/annotation?page=7974313"

        },
        "next": {
            "href": "http://api.iclikval.riken.jp/annotation?page=2"
        },
        "self": {
            "href": "http://api.iclikval.riken.jp/annotation?page=1"
        }
    },
    "page": 1,
    "page_count": 7974313,
    "page_size": 1,
    "total_items": 7974313
}
```
