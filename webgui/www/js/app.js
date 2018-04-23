var app = new Vue({
    el: '#app1',
    data: {
        pane: 'connect',
        address: 'ws://192.168.1.100:9090',
        path: 'http://192.168.1.100:8080/',
        username: '',
        password: '',
        loginerr: '',
        users: [
        ]
    },
    methods: {
        /** Deprecated. */
        output_test() {
            init();
        },
        /** Validate user and establish connection to ROS. */
        connect() {
            var vm = this;
            if (vm.username == '') {
                vm.loginerr = 'Please enter username!';
                return;
            }
            if (vm.password == '') {
                vm.loginerr = 'Please enter password!';
                return;
            }
            var validate = vm.users.find((element) => {
                return element.user === vm.username;
            });
            if (validate === undefined) {
                vm.loginerr = 'User does not exist!';
                vm.username = '';
                vm.password = '';
                return;
            }
            if (validate.password != vm.password) {
                vm.loginerr = 'Password incorrect!';
                vm.password = '';
                return;
            }
            vm.pane = 'default';
            setTimeout(init(vm.address), 1000);
        },
        /** Save the waypoints to external file. */
        save_points() {
            var vm = this;
            var blob = new Blob([JSON.stringify(waypoints)], {type: "application/json;charset=utf-8"});
            saveAs(blob, "waypoints.json");
        },
        /** Trigger the load-file dialog of load input that is hidden. */
        load_trigger() {
            $('input#file-points').click();
        },
        /** Load the waypoints from external file. */
        load_points() {
            var files = $('input#file-points')[0].files;
            if (files.length <= 0) return false;
            var fr = new FileReader();
            fr.onload = function(e) { 
                waypoints = JSON.parse(e.target.result);
                createWaypointButtons();
            }
            fr.readAsText(files.item(0));
        }
    },
    /** Define the default hostname. */
    created() {
        this.address = 'ws://' + location.hostname + ':9090';
        $.getJSON('/ur5_webgui/data/auth.json', (data) => {
            this.users = data;
        });
    }
});
