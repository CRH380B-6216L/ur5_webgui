
/**
 * Setup all visualization elements when the page is loaded. 
 */

var fixed_frame;
var current_group;
var link_group;
var end_effector_link;
var start_initial_flag = true;
var goal_initial_flag = true;
var joint_states;
var moveit_done;
var start_joint_states;
var goal_joint_states;
var start_im_client;
var goal_im_client;
var tfClient;
var startState;
var goalState;
var waypoints = [
/*
{ 
    "name": "Waypoint 1",
    "joints": ["shoulder_pan_joint", "shoulder_lift_joint", "elbow_joint", "wrist_1_joint", "wrist_2_joint", "wrist_3_joint"],
    "position": [0.7740378975868225, -0.7023871580706995, -1.9132474104510706, -2.043795887623922, 1.5586998462677002, -2.2743704954730433],
},
{
    "name": "65206",
    "joints": ["shoulder_pan_joint", "shoulder_lift_joint", "elbow_joint", "wrist_1_joint", "wrist_2_joint", "wrist_3_joint"],
    "position": [-0.009161297474996388, -0.9347050825702112, -1.385723892842428, -2.3387730757342737, 1.558675765991211, -2.2743824164019983],
},
{
    "name": "71098",
    "joints": ["shoulder_pan_joint", "shoulder_lift_joint", "elbow_joint", "wrist_1_joint", "wrist_2_joint", "wrist_3_joint"],
    "position": [-0.7952325979815882, -1.5823290983783167, -1.012385670338766, -2.0641935507403772, 1.5601749420166016, -2.3012993971454065],
},
{
    "name": "73455",
    "joints": ["shoulder_pan_joint", "shoulder_lift_joint", "elbow_joint", "wrist_1_joint", "wrist_2_joint", "wrist_3_joint"],
    "position": [-0.7952325979815882, -1.4711092154132288, -1.8966129461871546, -1.2912853399859827, 1.5601749420166016, -2.3012874762164515],
},
{
    "name": "76326",
    "joints": ["shoulder_pan_joint", "shoulder_lift_joint", "elbow_joint", "wrist_1_joint", "wrist_2_joint", "wrist_3_joint"],
    "position": [0.1711781769990921, -1.471144978200094, -1.8966129461871546, -1.2912614981280726, 1.5601749420166016, -2.3012993971454065],
}
*/
];
var prog_run_state = false;
var waypointID = 0;
var moveitLock = false;
var driver = "/ur_driver";

/** 
 * Establish connection.
 * @param {string} url - The url of the robot, like "ws://***:9090"
 */
function init(url) {
    // Connect to ROS.
    // console.log('Connect to ROS.');
    // var url = 'ws://' + location.hostname + ':9090';

    var real_ros = new ROSLIB.Ros({
        url : url
    });

    var virtual_ros = new ROSLIB.Ros({
        url : url
    });

    var joint_ros = new ROSLIB.Ros({
        url : url
    });

    joint_names = new ROSLIB.Param({
        ros: joint_ros,
        name: '/joint'
    });

    using_gazebo = new ROSLIB.Param({
        ros: real_ros,
        name: '/use_gazebo'
    });

    start_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/update_start_joint_position',
        messageType: 'std_msgs/Float64MultiArray'
    });

    goal_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/update_goal_joint_position',
        messageType: 'std_msgs/Float64MultiArray'
    });

    im_size_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/im_size/update',
        messageType: 'std_msgs/Float32'
    });

    moveit_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/moveit_joint',
        messageType: 'rwt_moveit/MoveGroupPlan'
    });

    execute_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/execute_trajectory',
        messageType: 'std_msgs/Empty'
    });


    joint_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/update_joint_position',
        messageType: 'std_msgs/Float64MultiArray'
    });

    computefkClient = new ROSLIB.Service({
        ros : joint_ros,
        name : '/compute_fk',
        serviceType : 'moveit_msgs/GetPositionFK'
    });

    start_initial_interactive_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/start/initial_marker',
        messageType: 'std_msgs/String'
    });

    goal_initial_interactive_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/goal/initial_marker',
        messageType: 'std_msgs/String'
    });

    start_interactive_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/start/marker/feedback',
        messageType: 'visualization_msgs/InteractiveMarkerFeedback'
    });

    goal_interactive_pub = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/goal/marker/feedback',
        messageType: 'visualization_msgs/InteractiveMarkerFeedback'
    });

    plan_listener = new ROSLIB.Topic({
        ros: joint_ros,
        name: '/stock_joint_position',
        messageType: 'std_msgs/Float64MultiArray'
    });

    robot_messages = new ROSLIB.Topic({
        ros: real_ros,
        name: '/rosout_agg',
        messageType: 'rosgraph_msgs/Log'
    });
    
    var resultname = '/follow_joint_trajectory/result';

    using_gazebo.get((value) => {
        console.log(value);
        if (value == true)
            resultname = '/arm_controller/follow_joint_trajectory/result';
    });


    // Create the main viewer.
    //console.log('Create the main viewer.');
    var width = parseInt($("#app1").css("width"));
    if (width >= 768) width = parseInt(width * 0.75);
    else if (width >= 576) width = parseInt(width / 2);
    console.log(width);
    var height = Math.max(
        $(document).height(),
        $(window).height(),
        /* For opera: */
        document.documentElement.clientHeight
    );
    if (width < 576) height = parseInt(height / 2);

    var viewer = new ROS3D.Viewer({
        divID : 'urdf',
        width : width,
        height : height,
        antialias : true,
        background: '#cccccc'
    });

    // Add a grid.
    console.log('Add a grid.');
    viewer.addObject(new ROS3D.Grid({color: '#666666'}));

    fixed_frame_param = new ROSLIB.Param({
        ros: real_ros,
        name: '/fixed_frame'
    });

    link_group_param = new ROSLIB.Param({
        ros: virtual_ros,
        name: '/link_group/'
    });

    end_effector_link_param = new ROSLIB.Param({
        ros: joint_ros,
        name: '/end_effector_link/'
    });

    // Setup listener
    console.log('Setup listener');
    var joint_listener = new ROSLIB.Topic({
        ros : virtual_ros,
        name : '/joint_states',
        messageType : 'sensor_msgs/JointState'
    });

    var goal_listener = new ROSLIB.Topic({
        ros : virtual_ros,
        name : '/goal_joint_states',
        messageType : 'sensor_msgs/JointState'
    });

    var start_listener = new ROSLIB.Topic({
        ros : virtual_ros,
        name : '/start_joint_states',
        messageType : 'sensor_msgs/JointState'
    });

    // Setup a client to listen to TFs.
    fixed_frame_param.get(function(value) {
        fixed_frame = value;
        tfClient = new ROSLIB.TFClient({
            ros : real_ros,
            fixedFrame : fixed_frame,
            angularThres : 0.01,
            transThres : 0.01,
            rate : 10.0
        });
        // Setup the marker client.
        /*start_im_client = new ROS3D.InteractiveMarkerClient({
            ros : real_ros,
            tfClient : tfClient,
            hidden : true,
            topic : '/start/marker',
            camera : viewer.camera,
            rootObject : viewer.selectableObjects
        });*/
        goal_im_client = new ROS3D.InteractiveMarkerClient({
            ros : real_ros,
            tfClient : tfClient,
            hidden : true,
            topic : '/goal/marker',
            camera : viewer.camera,
            rootObject : viewer.selectableObjects
        });
    });

    link_group_param.get(function(value) {
        link_group = value;
        for (group_name in link_group) {
            $('#group').append("<option value=" + group_name + ">" + group_name + "</option>");
        }
        $("select#group").bind('change', function() {
            var selector = $("select#group option");
            selector.each(function() {
                $("#" + $(this).val()).hide();
            });
            var group = $("select#group option:selected").val();
            current_group = group;
            $("#" + group).show();
            var msg = new ROSLIB.Message({
                data: current_group
            });
            // inform curren group
            start_initial_interactive_pub.publish(msg);
            goal_initial_interactive_pub.publish(msg);
            start_initial_flag = true;
            goal_initial_flag = true;
            create_joint_position_msg(1, true);
        });

        setTimeout(function() {
            createSliderView();
            createWaypointButtons();

            moveit_done = new ROSLIB.Topic({
                ros: real_ros,
                name: resultname,
                messageType: 'control_msgs/FollowJointTrajectoryActionResult'
            });

            moveit_done.subscribe((message) => {
                console.log("MoveIt!");
                moveitLock = false;
                if (message.result.error_code != 0) {
                    prog_run_state = false;
                    waypointID = 0;
                    return;
                }

                $("button#addwp").removeClass("disabled");

                if (prog_run_state) {
                    waypointID++;
                    if (waypointID < waypoints.length) {
                        var pname = waypoints[waypointID].name;
                        waypoint(pname);
                    }
                    else {
                        prog_run_state = false;
                        waypointID = 0;
                    }
                }
            });

            joint_listener.subscribe(function(message) {
                joint_states = message;
            });


            start_listener.subscribe(function(message) {
                start_joint_states = message;
                if($('input[name="manip"]:checked').val() != 0) return;

                var fk_link_name;

                if (end_effector_link[current_group] == null) {
                    fk_link_name = "tool0";
                }
                else {
                    fk_link_name = end_effector_link[current_group];
                }

                // Update interactive marker poisition
                var request = new ROSLIB.ServiceRequest({
                    header: {
                        seq: 0,
                        stamp: 0,
                        frame_id: fixed_frame
                    },
                    fk_link_names: [fk_link_name],
                    robot_state: {
                        joint_state: start_joint_states
                    }
                });

                computefkClient.callService(request, function(result) {
                    
                    var interactive_msg = new ROSLIB.Message({
                        marker_name: "start",
                        event_type: 0,
                        pose: {
                            position: {
                                x: result.pose_stamped[0].pose.position.x,
                                y: result.pose_stamped[0].pose.position.y,
                                z: result.pose_stamped[0].pose.position.z
                            },
                            orientation: {
                                x: result.pose_stamped[0].pose.orientation.x,
                                y: result.pose_stamped[0].pose.orientation.y,
                                z: result.pose_stamped[0].pose.orientation.z,
                                w: result.pose_stamped[0].pose.orientation.w
                            }
                        }
                    });
                    start_interactive_pub.publish(interactive_msg);
                });


                for (i = 0; i < start_joint_states.name.length; i++) {
                    var joint_name, joint_num;
                
                    for (j = 0; j < link_group[current_group].length; j++) {
                        if (link_group[current_group][j] == start_joint_states.name[i]) {
                            var min = $('input#' + link_group[current_group][j]).attr("min");
                            var max = $('input#' + link_group[current_group][j]).attr("max");
                            var percent = parseInt((start_joint_states.position[i] - min)/(max - min) * 100);
                            $('input#' + link_group[current_group][j]).attr("value", start_joint_states.position[i]);
                            document.getElementById(link_group[current_group][j]).value = start_joint_states.position[i];
                            break;
                        }
                    }
                }
                                              

            });

            goal_listener.subscribe(function(message) {
                goal_joint_states = message;
                if($('input[name="manip"]:checked').val() != 1) return;

                var fk_link_name;

                if (end_effector_link[current_group] == null) {
                    fk_link_name = "tool0";
                }
                else {
                    fk_link_name = end_effector_link[current_group];
                }

                // Update interactive marker poisition
                var request = new ROSLIB.ServiceRequest({
                    header: {
                        seq: 0,
                        stamp: 0,
                        frame_id: fixed_frame
                    },
                    fk_link_names: [fk_link_name],
                    robot_state: {
                        joint_state: goal_joint_states
                    }
                });

                computefkClient.callService(request, function(result) {
                        
                    var interactive_msg = new ROSLIB.Message({
                        marker_name: "goal",
                        event_type: 0,
                        pose: {
                            position: {
                                x: result.pose_stamped[0].pose.position.x,
                                y: result.pose_stamped[0].pose.position.y,
                                z: result.pose_stamped[0].pose.position.z
                            },
                            orientation: {
                                x: result.pose_stamped[0].pose.orientation.x,
                                y: result.pose_stamped[0].pose.orientation.y,
                                z: result.pose_stamped[0].pose.orientation.z,
                                w: result.pose_stamped[0].pose.orientation.w
                            }
                        }
                    });
                    goal_interactive_pub.publish(interactive_msg);
                    goal_initial_flag = false;
                });

                for (i = 0; i < goal_joint_states.name.length; i++) {
                    var joint_name, joint_num;
                
                    for (j = 0; j < link_group[current_group].length; j++) {
                        if (link_group[current_group][j] == goal_joint_states.name[i]) {
                            var min = $('input#' + link_group[current_group][j]).attr("min");
                            var max = $('input#' + link_group[current_group][j]).attr("max");
                            var percent = parseInt((goal_joint_states.position[i] - min)/(max - min) * 100);
                            $('input#' + link_group[current_group][j]).attr("value", goal_joint_states.position[i]);
                            document.getElementById(link_group[current_group][j]).value = goal_joint_states.position[i];
                            break;
                        }
                    }
                }
            });

            create_joint_position_msg(1, true);
            $('select#group').val('manipulator').change();
        }, 3000);

        setTimeout(function() {
            // Setup the URDF client.
            goalState = new ROS3D.UrdfClient({
                ros : virtual_ros,
                tfPrefix : 'goal',
                color : 0xff3000,
                tfClient : tfClient,
                hidden : true,
                param : 'robot_description',
                rootObject : viewer.scene,
                loader : ROS3D.COLLADA_LOADER
            });

            var urdfClient = new ROS3D.UrdfClient({
                ros : real_ros,
                tfClient : tfClient,
                param : 'robot_description',
                rootObject : viewer.scene,
                loader : ROS3D.COLLADA_LOADER
            });

            /*startState = new ROS3D.UrdfClient({
                ros : joint_ros,
                tfPrefix : 'start',
                color : 0x00df00,
                tfClient : tfClient,
                hidden : true,
                param : 'robot_description',
                rootObject : viewer.scene,
                loader : ROS3D.COLLADA_LOADER
            });*/

            $('#start_state').change(function() {
                if($(this).is(':checked')) {
                    if ($('input[name="manip"]:radio')[0].checked == true) {
                        start_im_client.showIntMarker('start');
                    }
                    startState.add();
                }
                else {
                    start_im_client.hideIntMarker('start');
                    startState.remove();
                }
            });

            $('#goal_state').change(function() {
                if($(this).is(':checked')) {
                    if ($('input[name="manip"]:radio')[1].checked == true) {
                        goal_im_client.showIntMarker('goal');
                    }
                    goalState.add();
                }
                else {
                    goal_im_client.hideIntMarker('goal');
                    goalState.remove();
                }
            });

            $('input[name="manip"]:radio').change(function() {
                if($(this).val() == 0){
                    if($('#start_state').is(':checked')) {
                        start_im_client.showIntMarker('start');
                    }
                    goal_im_client.hideIntMarker('goal');
                }else {
                    if($('#goal_state').is(':checked')) {
                        goal_im_client.showIntMarker('goal');
                    }
                    start_im_client.hideIntMarker('start');
                }
            });

        }, 1500);
    });

    //sleep(1500);
    end_effector_link_param.get(function(value) {
        end_effector_link = value;
    });

    plan_listener.subscribe(function(message) {
        message_stock.push(message);
    });

    robot_messages.subscribe((message) => {
        if (message.level != 8) return;
        if (message.name == driver) {
            console.error(message.msg);
            alert(message.msg);
            prog_run_state = false;
            $("button#addwp").addClass("disabled");
            waypointID = 0;
        }
    });

    $("button#init").click(function() {

        positions = new Array();
        dims = new Array();

        $("#" + current_group).children("label").each(function() {
            var dim = new ROSLIB.Message({
                label: ($(this).attr("id").split("-")[0]),
                size: ($(this).attr("id").split("-")[0]).length,
                stride: ($(this).attr("id").split("-")[0]).length
            });
            dims.push(dim);
            for (var i = 0; i < joint_states.name.length;i++) {
                if (joint_states.name[i] == dim.label) {
                    positions.push(joint_states.position[i]);
                    break;
                }
            }
        });

        var msg;
        msg = new ROSLIB.Message({
            layout: {
                dim: dims,
                data_offset: 0
            },
            data: positions
        });
        if($('input[name="manip"]:checked').val() == 0) {
            start_pub.publish(msg);
        }
        else {
            goal_pub.publish(msg);
        }
    });

    $("button#preview").click(function() {
        if(message_stock != null) {
            var i = 0;
            var tmp_start_joint_states = start_joint_states;

            timer = setInterval(function() {
                start_pub.publish(message_stock[i]);
                i++;
                if(i == message_stock.length) {

                    positions = new Array();
                    dims = new Array();

                    $("#" + current_group).children("label").each(function() {
                        var dim = new ROSLIB.Message({
                            label: ($(this).attr("id").split("-")[0]),
                            size: ($(this).attr("id").split("-")[0]).length,
                            stride: ($(this).attr("id").split("-")[0]).length
                        });
                        dims.push(dim);
                        for (var i = 0; i < tmp_start_joint_states.name.length;i++) {
                            if (tmp_start_joint_states.name[i] == dim.label) {
                                positions.push(tmp_start_joint_states.position[i]);
                                break;
                            }
                        }
                    });

                    var msg;
                    msg = new ROSLIB.Message({
                        layout: {
                            dim: dims,
                            data_offset: 0
                        },
                        data: positions
                    });
                    
                    start_pub.publish(msg);
                    clearInterval(timer);
                }
            },100);
        }
    });

    $("button#moveit").click(function() {
        var msg = create_joint_position_msg(0,false);
        moveit_pub.publish(msg);
    });

    $("button#plan").click(function() {
        message_stock = new Array();
        var msg = create_joint_position_msg(0,true);
        moveit_pub.publish(msg);
    });

    $("button#execute").click(function() {
        if(message_stock != null) {
            sim_mode = new ROSLIB.Param({
                ros: joint_ros,
                name: '/sim_mode'
            });
            sim_mode.get(function(value) {
                if (value == true) {
                    timer = setInterval("joint_publish()",100);
                }
                else {
                    var msg = new ROSLIB.Message({
                    });
                    execute_pub.publish(msg);
                }                
            });
        }
    });
}

/** 
 * Plan (create) MoveIt! goal state and publish immediately. 
 * @param {int} type - 0: create plan or 1: update slide value
 * @param {bool} plan_only - No execution after planning
 */
function moveit_call(type, plan_only) {
    var msg = create_joint_position_msg(type, plan_only);
    moveit_pub.publish(msg);
}

/** 
 * Plan (create) MoveIt! goal state. 
 * @param {int} type - 0: create plan or 1: update slide value
 * @param {bool} plan_only - No execution after planning
 */
function create_joint_position_msg(type, plan_only) {

    console.log('create_joint_position_msg');

    positions = new Array();
    start_positions = new Array();
    goal_positions = new Array();
    dims = new Array();

    $("#" + current_group).children("label").each(function() {
        var dim = new ROSLIB.Message({
            label: ($(this).attr("id").split("-")[0]),
            size: ($(this).attr("id").split("-")[0]).length,
            stride: ($(this).attr("id").split("-")[0]).length
        });
        dims.push(dim);
        if (type == 0) {
            for (var i = 0; i < start_joint_states.name.length;i++) {
                if (start_joint_states.name[i] == dim.label) {
                    start_positions.push(start_joint_states.position[i]);
                    goal_positions.push(goal_joint_states.position[i]);
                    break;
                }
            }
        }
        else {
            //positions.push(parseFloat($(this).next().attr("value")));
            var sliderID = $(this).attr("id");
            positions.push(parseFloat($('input#' + sliderID)[0].value));
            $('span#' + sliderID).text($('input#' + sliderID)[0].value);
        }
    });

    var msg;
    if (type == 0) {
        msg = new ROSLIB.Message({
            start_joint: {
                layout: {
                    dim: dims,
                    data_offset: 0
                },
                data: start_positions
            },
            goal_joint: {
                layout: {
                    dim: dims,
                    data_offset: 0
                },
                data: goal_positions
            },
            plan_only: plan_only,
            group_name: current_group
        });
    }
    else {
        msg = new ROSLIB.Message({
            layout: {
                dim: dims,
                data_offset: 0
            },
            data: positions
        });
    }
    return msg;
}

/** Update the goal state of the robot. */
function callback() {
    $("button#addwp").addClass("disabled");
    var msg = create_joint_position_msg(1, true);
    if($('input[name="manip"]:checked').val() == 0) {
        start_pub.publish(msg);
    }
    else {
        goal_pub.publish(msg);
    }
}

/** Part of procedures executing the planned goal state. */
function joint_publish() {
    console.log('joint_publish');
    if(message_stock.length == 0) {
        clearInterval(timer);
    }
    else {
        joint_pub.publish(message_stock.shift());
    }
}

/** Initialize the buttons for waypoints. */
function createWaypointButtons() {
    $("#btn-waypoints").empty();
    waypoints.forEach((element) => {
        $("#btn-waypoints").append('<button type="button" class="btn btn-secondary mr-1" onclick="waypoint(\'' + element.name + '\')">' + element.name + '</button>');
    });
    if (waypoints.length > 0) {
        $("#btn-waypoints").append('<button type="button" class="btn btn-success mr-1" onclick="run_all_waypoints()">Run All Waypoints</button>');
        $("button#save-points").removeClass("collapse");
    }
    else
        $("button#save-points").addClass("collapse");
}

/** Initialize the sliders of the joints. */
function createSliderView() {
    console.log('createSliderView');
    var i = 0;
    for (group_name in link_group) {
        $("#slider-pane").append('<div id="' + group_name + '"/>');
        if (i != 0) {
            $("#" + group_name).hide();
        }
        else {
            current_group = group_name;
            i++;
        }
    }
    joint_names.get(function(value) {
        names = value.names;
        for (group_name in link_group) {
            for (var i = 0;i < names.length;i++) {
                if (link_group[group_name].indexOf(names[i]) != -1) {
                    child = $('<label>', {for: names[i], text: names[i], class: "col-form-label-sm", id: names[i]});
                    child3 = $('<span>', {class: "float-right", text:"0", id: names[i]});
                    child2 = $('<input>', {type: "range", name: names[i], class: "form-control form-control-sm", id: names[i], value: 0, max: eval("value." + names[i] + ".max"), min: eval("value." + names[i] + ".min"), step: 0.000001, oninput: "callback()", onchange: "callback()"});
                    $("#" + group_name).append(child);
                    $("#" + group_name).append(child3);
                    $("#" + group_name).append(child2);
                }
            }
        }
        //$.getScript("js/jquery-mobile/jquery.mobile-1.3.2.min.js");
        var msg = new ROSLIB.Message({
            data: current_group
        });
        start_initial_interactive_pub.publish(msg);
        goal_initial_interactive_pub.publish(msg);
    });
}

/** (Currently not in use) Set the size of interactive marker. */
function im_size_callback() {
    console.log('im_size_callback');
    var size = parseFloat($("#im-size").val());
    var msg = new ROSLIB.Message({
        data: size
    });

    if ($('input[name="manip"]:radio')[0].checked == true && $('#start_state').is(':checked')) {
        im_size_pub.publish(msg);
        start_im_client.hideIntMarker('start');
        setTimeout(function() {
            start_im_client.showIntMarker('start');
        }, 500);
    }
    else if($('input[name="manip"]:radio')[1].checked == true && $('#goal_state').is(':checked')){
        im_size_pub.publish(msg);
        goal_im_client.hideIntMarker('goal');
        setTimeout(function() {
            goal_im_client.showIntMarker('goal');
        }, 500);
    }
}

/** 
 * Run a specific waypoint by its name. 
 * @param {string} myname - The name of waypoint.
 */
function waypoint(myname) {
    point = waypoints.find((element) => {
        return element.name == myname;
    });
    point.joints.forEach((currentValue, index) => {
        $('input#' + currentValue)[0].value = point.position[index];
    });
    callback();
    moveitLock = true;
    setTimeout(() => {
        moveit_call(0, false);
    }, 300);
}

/** Run all waypoints in order. */
function run_all_waypoints() {
    if (waypoints.length == 0) {
        alert("No waypoints set!");
        return;
    }
    if (prog_run_state) {
        prog_run_state = false;
        return;
    }
    prog_run_state = true;
    waypointID = 0;
    var pname = waypoints[waypointID].name;
    waypoint(pname);
}

/** Add current position as a new waypoint at the end of waypoint list. */
function add_waypoint() {
    var wp_name = $("input#wp-name")[0].value;
    if (wp_name == "") {
        alert("Please name the waypoint!");
        return;
    }
    var new_wp = {};
    new_wp.name = wp_name;
    new_wp.joints = joint_states.name;
    new_wp.position = joint_states.position;
    waypoints.push(new_wp);
    createWaypointButtons();
}
