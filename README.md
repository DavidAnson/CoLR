# CoLR, the Camera of Last Resort

> Possibly worse than no camera at all...

## What is it?

An absurdly simple photo app for devices with a camera and a web browser that supports [ECMAScript 2015](https://en.wikipedia.org/wiki/ECMAScript).
It doesn't do much, and it doesn't do it well, but at least it's free.

> Good, cheap, fast: you only get one and you don't get to pick.

## How do I use it?

1. Open <https://dlaa.me/CoLR/>
2. Allow the website access to the camera
3. Find something interesting to capture
4. Tap the live camera view to take a picture
5. Tap a thumbnail to view a saved picture
6. Tap the red 'X' to delete a saved picture
7. Tap the live camera view to take more pictures

## Where can I run it?

I've used the following browser/platform configurations:

- iOS/Safari
- Android/Chrome
- Chromebook/Chrome
- Windows/Chrome

It _should_ work in other modern browsers/platforms as well.

> To experiment on a machine without a camera, the command line `chrome.exe --use-fake-device-for-media-stream --use-fake-ui-for-media-stream` is helpful.
> More info on [relevant WebRTC flags can be found here](https://webrtc.org/testing/).

## Why did you make this?

To learn more about the following technologies and get experience using them:

- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) - A modern layout system based on grid cells with the great working reference [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
  - *Verdict*: It's not quite a [WPF Grid Panel](https://docs.microsoft.com/en-us/dotnet/api/system.windows.controls.grid?view=netframework-4.8), but it feels very similar
- [MediaDevices.getUserMedia() API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) - The part of the [WebRTC Media Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API) that allows websites to access the device camera for video and image capture
  - *Verdict*: A somewhat cumbersome API that's nonetheless quite powerful
- [Preact](https://preactjs.com/) - Exactly what it says on the box, a "Fast 3kB alternative to React with the same modern API."
  - *Verdict*: Works like a charm, easy for someone with [React.js](https://reactjs.org/) experience
- [Dexie.js](https://dexie.org/) - More truth in advertising, a "Minimalistic Wrapper for IndexedDB", where [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) is "a JavaScript-based object-oriented database" that runs in the browser
  - *Verdict*: Easy to use, even for someone with no prior IndexedDB experience

## Where can I learn more?

- The article [Taking still photos with WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos) covers the all the basics.
  I'd read it a long time back, forgot about it for this project, then rediscovered it for this write-up.
- The [WebRTC samples page](https://webrtc.github.io/samples/) has lots of examples and complete code for each of them.
- The [GitHub repository for this project](https://github.com/DavidAnson/CoLR) may also be of interest.

## Why are some photos blurry?

The most likely culprit is (too long) shutter speed.
Grabbing a frame from a video is not the same as taking a single photo (and post-processing it).
A good explanation seems to be the second answer in the post [Can I get high resolution photo from video?](https://photo.stackexchange.com/questions/7872/can-i-get-high-resolution-photo-from-video).
If you want to do better, maybe start with [Generating Sharp Panoramas from Motion-blurred Videos](https://neelj.com/projects/sharppanoramas/) or [Video Snapshots: Creating High-Quality Images from Video Clips](https://www.eecs.harvard.edu/~kalyans/research/snapshots/VideoSnapshots_TVCG12.pdf)).
*Shout out to Professor Huttenlocher!*

## Why not use blobs?

Captured images are encoded to [JPEG](https://en.wikipedia.org/wiki/JPEG) using methods on the [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) interface.
Both [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) and [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) formats are supported - and have limitations - but data URL is used because the string-based format is easier to work with and debug against.
