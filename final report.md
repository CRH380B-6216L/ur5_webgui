# Introduction
This project is to build up a control-box web application for an industrial robot with JavaScript, which is to be run in any devices and compatible with any industrial robots.

Universal Robots UR5 is equipped in the labortary so it is used for this project. ...

Chapter 2 provides information about the company.

Chapter 3 gives all the details about the project and its related things.

Chapter 4 describes how the project is done.

Chapter 5 concludes this project.

# Company Overview
The Fontys mechatronics laboratory main goal is to recreate and solve industrial challenges while contributing to Fontys students education. The challenges that students face in the lab, are developed following stricted use case scenarios that company partners face in a daily basis, because of that, students get to work in the most innovative topics, giving to our company partners a proof of concept before implementing new technologies.

Engineering students in semester 7 will attend the automation & robotics class and do their practical in the robotics laboratory. The practice content is shifting from the production of dedecated production lines with a fixed layout and processing order for a product or product family, towards intelligent, more or less autonomous, processing stations that can be combined in an ad-hoc way depending on the desired product.

# Project Overview
## Facts

### Universal Robots UR5
Universal Robots is a Danish robotics company founded in 2005. It provides UR3, UR5 and UR10 series of industrial robots to meet worldwide industrial automation requirements in different levels. UR5 is a typical 6-axis industrial robot. The maximum payload of UR5 is 5 kg and its work radius is 850 mm. (Universal Robots A/S, 2009)

Fontys Robotics Laboratory equips two UR5 robots, one of which is used for this project.

### ROS
The Robot Operating System (ROS) is a flexible framework for writing robot software. It is a collection of tools, libraries, and conventions that aim to simplify the task of creating complex and robust robot behavior across a wide variety of robotic platforms. (About ROS, n.d.)

There are many ways to communicate with ROS:
- Call services,
- Subscribe to or publish on topics, and
- Get or set parameters.

### URDF and TF

### MoveIt!

### RobotWebTools (including roslibjs and ros3djs)
RobotWebTools is ...

roslibjs uses WebSockets to connect with rosbridge (the server side for ROS) and provides publishing, subscribing, service calls, actionlib, TF, URDF parsing, and other essential ROS functionality. Functionalities of connection, publishing, subscribing, service calls and parameter updating are used in this project.

ros3djs provides a 3D visual of ROS in collaboration with THREE.js. 

### Vue.js

## Target of Project
The project is aimed to research, design and develop a web based graphical user interface (GUI) that lets the users communicate, program and visualize Industrial robots from different brands that are connected to it. The web based GUI is developed using Javascript, HTML5, CSS and roslibjs for the front-end and it must connect to rosbridge as the server running in ROS (Robot operating system).

Industrial robots have its own GUI to let users program and interact with the robots. Each brand of Industrial robots has its own GUI and they can be very different. 

The assignment requires the design and development of a GUI that lets any possible user easily program and interact with any industrial robot connected through rosbridge in ROS to the GUI.

## Goals and Objectives
- Design following Human-computer interaction (HCI) patterns for industrial robots and that communicates to the ROS server using roslibjs.
- Let the user visualize in 3D the movement that the industrial robot will perform.
- Make sure the app can run efficiently in different modern browsers and devices (laptops, tablets and phones).
- Document the product well and make it easily maintainable and extendable.
- Follow the Agile method and meet in a weekly basis with trainee’s company tutor to inform any new challenge and the state of the project.

## Analysis to the project
### DOT Framework
In the project, the DOT framework is applied during research phase. The simple procedure of each research like below:
1.	Follow online tutorials and documents (Library, Lab)
2.	Try to build prototype (Workshop)
3.	Show the result on request (Showroom)

# Project Progress
This project is splitted into two parts: prototyping and final product developing.
## Prepositive Prototypes
Before the final project was done, there are three prototypes were made for preparation as following:
- turtlesim on the web
- URDF online viewer
- MoveIt! web-based planner

These prototypes helped to master the necessary technologies that was to be used in the development of final product.

### Prototype 0: turtlesim on the Web
turtlesim is an ROS application that is used in ROS official tutorials. This application helps beginners know the basic knowledge of ROS. This prototype is aim to get a brief overview of ROS and how to communicate between browser and ROS with connection of rosbridge and the driver roslibjs. It simulates the interface of turtlesim and provides some functions by communicate to specific topics and services.

turtlesim has a 500 by 500 background color-changeable field and a turtle inside. The turtle has X, Y, Theta properties for its position in the field, and when it moves, it leaves its trace in the field. The brush width and color can also be changed. To move the turtle, linear and angular velocity values are to be sent for the movement of turtle, which will drive turtle to move for 1 second. 

This prototype reproduces the field and the turtle in it, which is built in such structure:

- `div#canvas`: main field with background color set by turtlesim
  - `canvas#drawing`: records pen track of turtle
  - `div#turtle`: sets the position and rotation, contains the image of turtle
    - `img#turtleImage`: the turtle that can be seen in the webpage

By subscribing `turtle1/pose` topic the display refreshes to show the state of turtlesim in real-time. 

The control panel provides the functionalities of moving 1 step, moving constantly and stop, changing pen color including turning pen on or off and change background color.

roslibjs is introduced to let the prototype communicate with ROS. It is used to connect the prototype to ROS, subscribe the topics of turtle’s position, pen color and background color, publish the topic of move, call the service of ***. The prototype also uses setInterval() to achieve letting the turtle move constantly by publishing the same topic per every second and stops it by using clearInterval() when user clicks “Stop” button.

This prototype was done in the first month of the project period. By working on it, we had a general understanding of ROS and how to use roslibjs to communicate between ROS and the browser.

### Prototype 1: URDF Online Viewer
This prototype is an application of usage of ros3djs. It presents the status of connected robot by showing its 3D-model in real-time in the browser. 

ros3djs provides a 3D visual of robot in collaboration with THREE.js. 

### Prototype 2: MoveIt! Web-Based Planner
MoveIt! is a very popular motion planning tool in ROS, which is also used in this project. This prototype lets the browser contact MoveIt! to make movement to the robot.

A similar webapp that already exists is found for this project. However, this webapp could not be used at first. This webapp is called rwt_moveit, which is created by Tokyo Opensource Robotics Kyokai Assosiation, and based on Denso VS060 industrial robot. We contacted them for the solution of the problem and finally found the way to solve it.

...

## Development of Final Product

### Rebuild User Interface

### Login (prototype)
A login page is introduced into this application. It prevents unauthorized personnel from improperly using this application and any personal injury or property damage caused by that.

The code of this part is under Vue.js pattern. That means the inputs of username and password are linked with the related variables and the latter updates when the inputs change. When user clicks “Login and connect” button, It checks if the user exists and the password is correct. Currently, as a prototype, the user data is hard-coded into the script file.

### Adding, Going to, Saving and Loading of Waypoints
When the goal state of MoveIt! planning executed successfully, the “Add Waypoints” button turns enabled and user can click to save the waypoint into the list (array). The array preserves all waypoints user saved. The waypoints will show as buttons with the name of each waypoint. By clicking it, the robot will move to the waypoint immediately. User can also let the robot moves via all waypoints in order by clicking “Run All Waypoints”.

The information of joints is extracted from the message of /joint_states with each waypoint’s name, its joints’ names and positions. This is done by set the joint values of sliders as of waypoint, make a MoveIt! planning and execute it in one step. which is done by planning and executing all the waypoints one by one.  In this procedure, the completion of robot's each step is detected by subscribing from topic `/follow_joint_trajectory/result` or `/arm_controller/follow_joint_trajectory/result`, following with actions of planning and executing next waypoint in the list or step out after last waypoint is executed.

The list of waypoints can be saved as a JSON file by clicking "Save Waypoints" button. The array of waypoints is converted to JSON and taken over by FileSaver.js for saving it to external file. The loading of file is splitted into two steps. The first step is trigger `click` event of a hidden file input to call the open file dialog when user clicks "Load Waypoints" button. The second step happens when a file is selected, which means the file input has changed. `FileLoader` in JavaScript is used for load the JSON file. After that, the JSON will be converted to array and overwrite the current one.

### Receiving E-Stops and Protective Stops
An emergency button is equipped on UR5 robot. When something emergency happens, the operator can press this button to force the robot stop and lock it. The protective stop is triggered when the robot unexceptedly deviates from its establised track in robot moving to help protective the robot from being damaged. These measures protect the safety of the robot, the operators and the production line. 

The UR driver can also detect emergency stops and protective stops. When an emengency stop or a protective stop occurs, ROS will receive one of these following messages:

```
[ERROR][T] Emergency stop pressed!
[ERROR][T] Robot is protective stopped!
```

According to the result of monitoring the topic `/rosout_agg`, these messages are found from a node called 'driver'. With this, the topic `/rosout_agg` is subscribed; However, only the messages which are typed as "Error" and come from "driver" will be responsed. The messages will be popped as a message box to tell the user the robot is emergency or protective stopped, stop the running waypoints and prevent user from adding new waypoint here.

# Conclusion
## Project Summary

## Unsolved Problems and Further Functionalities
Because of time limit of the internship, some problems and functions are not solved in the project. The following aspects can be the goals of further project(s) based on this product.

### Move robot by using arrow buttons (using kinematics.js)
Buttons for move and rotate are placed into the GUI, but functions are not implemented. To make the robot move by arrows possible, the X, Y, Z values of the position and rotation of the robot end effector should be calculated. kinematics.js is a utility that can calculate the posture of end effector with the positions and values of the 6 joints. It is included in the product and can be used for position calculation. 

### Work with Node.js for login and database of waypoints
The login function is just a prototype and there is no user management function provided. It is suggested to use Node.js and mongodb to save user data better and safer. The login page should also based on the user data in the Node.js database. In addition, the app can do more such as saving the program made by specific user with the database.

### Enhancement functionality of programming
The simple programming tool only provide the function of adding the waypoint to the list and save/load the list to/from external file. It can be extended to be more functional by adding waypoints removal and reordering function, simple logical and loop statements and variable operations.

### Stability of robot motion
When using the real robot, protective stops often occur. This is because the robot moves too fast and sometimes it misses the target point. To protect the robot, a protective stop is triggered by itself; then the robot is to be unlocked from its HCI. It is necessary to improve the driver module to avoid the robot from moving fast, stopping heavily and triggering protective stops.

### Compatible with other types of industrial robots
This web-based GUI app is compatible to Universal Robots UR5. However, it may also suitable for any type of 6-axis industrial robots or even any robots that using ROS. This product can be splitted into two parts: common part that is same to all robots, and special part that differs to adapt each robot. When adapting a new type of robot, the common part should not change, while the special part can be copied from sample and modified to fit the data and settings of the new robot.

### Make good use of Vue.js
Only part of the code is under Vue.js environment. Putting everything inside the Vue object in app.js file can make good use of Vue.js functionalities and make further coding easier.