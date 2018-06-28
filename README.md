# djwannabe-step-sequencer
### Step sequencer written in Javascript using the Web Audio API

This application was developed for the [Individual Software Development Project](http://coursepress.lnu.se/kurs/individuellt-mjukvaruutvecklingsprojekt/) course.

### Content
1. **Techniques used for this application**  
2. **Application**  
2.1 Functionalities  
2.1.1 Overview  
2.1.2 Audio snippet container  
2.1.3 Playlist  
2.1.4 Controller  
2.1.5 Mixer board  


# 1 Techniques used for this application
* jQuery
* Web Audio API
* Browserify

jQuery was used for the drag & drop functionality of the sample boxes and slots.

The Web Audio API was used for the audio playback, effects and controls.

Browserify was used in order to separate the code into modules.

# 2 Application
[Live demo](https://jonaserixon.github.io/djwannabe-step-sequencer/). (Firefox is recommended)

## 2.1 Functionalities

### 2.1.1 Overview

With the DJ Wannabe step sequencer it is possible to create short tracks using an existing sample library of sound snippets. 

A user simply clicks on any random sample from the **library** that can be found in the top-right corner of the application and it will appear in a container consisting of the selected samples made by the user. These boxes that represents **audio snippets are draggable**, and are meant to be dropped into the **sample slots** that can be found in the **playlist**.

<img src="https://i.imgur.com/xWjxjA9.png" width="600px"/>  

_Figure 1 - Overview of the application in action_




### 2.1.2 Audio snippet container

From the container of a user's selected audio snippets it is possible to either drag and drop the audio into any of the playlist's channels or remove them by dropping them in the garbage bin.

<img src="https://i.imgur.com/VgG4jFi.jpg" width="600px"/>  

_Figure 2 - Container with a user's selected audio snippets_



### 2.1.3 Playlist

The playlist consists of **5 layers of channels**, meaning that a maximum of 5 audio samples can be played simultaneously.

Every single slot of the 5 channels are droppable. A sample box can be dragged from its slot and be dropped on to any other sample slot. This will overwrite any previous sample box on that slot. 

<img src="https://i.imgur.com/TZ78nYu.jpg" width="600px"/>  

_Figure 3 - Playlist consisting of 5 channels_




### 2.1.4 Controller

The controller for the application is draggable. It controls the play and stop functionality of the playlist. It is possible to choose a starting point from which column in the playlist the sounds will start playing. 

A user can record the audio from the playlist in real-time (_including using the effects and controls available in the mixer board_) by clicking on the record button. This will be downloadable in a .ogg file when the user clicks on the stop button.

<img src="https://i.imgur.com/oxKn5P3.jpg" width="400px"/>  

_Figure 4 - Application controller_



### 2.1.5 Mixer board

In the mixer board it is possible to control the 5 channels in the playlist. 

**List of controls available**
 - Volume
 - Mutable
 - Low-pass filter
 - Left / Right - panning
 - Chorus effect

<img src="https://i.imgur.com/zqZ9u0r.jpg" width="600px"/>  

_Figure 5 - Mixer board_
