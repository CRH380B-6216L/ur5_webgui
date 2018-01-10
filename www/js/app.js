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
            {
                "user":"admin",
                "password":"admin"
            },
            {
                "user":"eru",
                "password":"chitanda"
            }
        ]
    },
    methods: {
        output_test() {
            init();
        },
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
        save_points() {
            var vm = this;
            var blob = new Blob([JSON.stringify(waypoints)], {type: "application/json;charset=utf-8"});
            saveAs(blob, "waypoints.json");
        },
        load_trigger() {
            $('input#file-points').click();
        },
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
    created() {
        this.address = 'ws://' + location.hostname + ':9090';
    }
});