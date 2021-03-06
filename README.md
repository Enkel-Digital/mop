# Ministry Of Pup (MOP) monorepo
Code base for all the software written for [Ministry Of Pup](https://ministryofpup.com/)


## Subrepos
- [admin](./admin)
    - Admin portal for use on the store's ipad
- [api](./api)
    - Monolithic API backend for all logic
- [appointment-src](./appointment-src)
    - Shared JS package to map appointment abbrevations to their full names
- [booking](./booking)
    - Booking system's frontend booking app for users to book appointments
- [landing](./landing)
    - Landing page of [Ministry Of Pup](https://ministryofpup.com/)
- [pdf](./pdf)
    - Utility library for handling PDF generations for the API
- [functions](./functions)
    - Firebase cloud functions
- [gapi](./gapi)
    - Go API server with super low cold start time for the landing page get dogs API.
- [rapi (abandoned)](./rapi)
    - Rust API server with super low cold start time for the landing page get dogs API.
    - See [gapi](./gapi) instead


## License, Author and Contributing
This project is developed and made available under the [AGPL v3 License](./LICENSE)  
If you have any questions, contact us via [email](mailto:developer@enkeldigital.com)  
Author: [JJ](https://github.com/Jaimeloeuf)
