# Windows / Android Setup

This document aims to improve the onboarding process for those wanting to become involved in the project, particularly those with Windows OS and wanting to emulate for android.
The steps outlined in this guide are the ones I took to get my development environment set up and running on my own laptop as well as desktop. You may or may not require additional steps to get your program working.


### Getting started

The mobile app is being developed using Axway's [Appcelerator Titanium](https://www.appcelerator.com/signup/).
Follow the link to sign-up as well as their [instructions](https://platform.axway.com/#/product/cli) on getting started.
The Appcelerator studio is optional so I recommend just installing the **CLI** and using your IDE of choice to work on the project.

After you have installed the **Android SDK** via **Android studio**, you will also need to set up your virtual device if you wish to emulate for testing purposes.

With android studio open, click the 'AVD Manager' icon in the top right
![AVD Manager Icon](https://image.ibb.co/bXR3o0/android-studio-AVD.jpg)

This will bring up a window that shows any android virtual devices that you have installed. Create a new virtual device with the button at the bottom left and choose a phone that has Play Store capabilities for testing.

For example, I chose the *Pixel 2*

![Pixel 2 virtual device](https://preview.ibb.co/ehn9T0/pixel-2-vd.jpg)

Choose ***API 27(Oreo) or lower*** as many devices do not have, or have not yet received, the newest API 28(Pie)

After this is completed I also recommend running the emulator just to make sure all is well and that it is running as expected on your machine.

> **NOTE:** Your machine must have virtualization capabilities in order to emulate android devices. This may require you going into your computers BIOS and simply enabling it.
## Replacing your GUID in ```tiapp.xml```

Applications build with Titanium have unique GUIDs associated with them which seem to be machine specific. Trying to build and or run the project without your personal GUID will prompt
you with an error
```shell
Application is not registered.
```

Therefore, you must replace the **GUID** within the ```tiapp.xml``` file with your **own personal GUID**. To do this,
create a blank titanium project with the **CLI**
```shell
appc new --type app --name APP_NAME --id com.appcelerator.APP_NAME
```

Where ```APP_NAME``` is replaced with whatever you want to name your project. This is unimportant since this will just be a skeleton created to retrieve your GUID.
Navigate to the project folder and open its ```tiapp.xml``` file

Find and copy ```YOUR_GUID``` which will be a series of letters and numbers.
```xml
<guid>YOUR_GUID</guid>
```

> . . ./APP_NAME/tiapp.xml

Replace the **GUID** in the project with ```YOUR_GUID```
> . . ./cary-connects-mobile/tiapp.xml

### Build and run app
Given that everything has been installed and configured correctly, navigate to the project folder within your **CLI** and you can **build and run** the project using the command:
```shell
appc run --platform android
```
Which will launch your emulator, create the .apk and install it on your android virtual device.

![cary connects app splash screen](https://image.ibb.co/mF19d0/app-icon-frame-framed.png)
