const functions = require('./funcs');
const be = [
    [
        "-LgYKqcGWOvpaEdN-uXI",
        {
            "creationDate": "Tue Jun 04 2019 13:34:18 GMT-0300 (GMT-03:00)",
            "post": {
                "message": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                "title": "Como fazer macarrao sem as maos"
            },
            "rates": 0
        }
    ],
    [
        "-LgYL3lcLxcUkV3hlQXS",
        {
            "creationDate": "Tue Jun 04 2019 13:35:16 GMT-0300 (GMT-03:00)",
            "post": {
                "message": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                "title": "Como conhecer uma garota"
            },
            "rates": 3
        }
    ]
]

test('Check firebase output data format', () => {
    functions.getPosts().then(res => {
        expect(JSON.stringify(res)).toMatch(JSON.stringify(be))
    })
});