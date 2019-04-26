# FIND AUTH KEY ON DLIVE

1.  Open a url to your stream or any page where you can send chat messages.
2.  Open the dev console _(note I will be walking through this process on chrome)_ for chrome do `ctrl + shift + j`
3.  Once open, look at the top of the developer console and navigate to the `Network` tab ![Dev console](./readmefiles/networktab.png)
4.  With that tab open send a message in chat, doesn't need to be anything specific and you should see two new requests in that panel labeled `graphigo.prd.dli...` I wont get into the specifics of what these are, but basically it tells the server who you are and what message you would like to send.
5.  Click on the bottom `graphigo.prd.dli...` and you should be greeted with a page something like this ![Graph Response](./readmefiles/graph.png)
6.  Copy the string of text next to the header called `authorization` it should be pretty long _(this string is found right where my cursor is in the image)_

Note that this will be replaced in the future by a chrome extension that will let you easily get your auth key/token.
