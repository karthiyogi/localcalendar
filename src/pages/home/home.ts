import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

import * as moment from 'moment';
import { Calendar } from '@ionic-native/calendar';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    notifyTime: any;
    notifications: any[] = [];
    days: any[];
    chosenHours: number;
    chosenMinutes: number;

    constructor(public navCtrl: NavController, private calendar: Calendar, public platform: Platform, public alertCtrl: AlertController, private localNotifications: LocalNotifications) {


        this.notifyTime = moment(new Date()).format();

        this.chosenHours = new Date().getHours();
        this.chosenMinutes = new Date().getMinutes();

        this.days = [
            { title: 'Monday', dayCode: 1, checked: false },
            { title: 'Tuesday', dayCode: 2, checked: false },
            { title: 'Wednesday', dayCode: 3, checked: false },
            { title: 'Thursday', dayCode: 4, checked: false },
            { title: 'Friday', dayCode: 5, checked: false },
            { title: 'Saturday', dayCode: 6, checked: false },
            { title: 'Sunday', dayCode: 0, checked: false }
        ];
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            console.log("-----------------in view did load-------------------");

            this.calendar.hasReadWritePermission().then((res: any) => {
                console.log(res);
                if (!res) {
                    this.calendar.requestReadWritePermission()
                        .then((res: any) => {
                            console.log(res);

                        }).catch((err: any) => {
                            console.log(err);

                        })
                }

            }).catch((err: any) => {
                console.log(err);


            })
            // this.localNotifications.hasPermission().then(function(granted) {
            //     console.log(granted);
            // if (!granted) {
            //     console.log("Here for registration");
            // this.localNotifications.registerPermission();
            // }
            // });
        });
    }

    getCalendarOption(){
        console.log("inside");
        
    //    let value = this.calendar.getCalendarOptions()
    // //    console.log(value);

    //    let value2 = this.calendar.listCalendars()
    //    console.log(value2);
      let  startdate =new Date("January 01 2018 12:30");
      let enddate = new Date("January 01 2019 12:30");
       this.calendar.listEventsInRange(startdate,enddate).then(( res:any ) => {
           console.log("result")
           console.log(res)
       })
    //    console.log(value3);
    }

    addToCalendar(){
        console.log("I am called");
        
        let startdate = new Date("February 24 2018");
        let enddate = new Date("February 24 2018");
        let options ={
            calendarId : 4,
            recurrence : "yearly"
        }
        this.calendar.createEventWithOptions("Karthikeyan Cts Ece's anniversary",null,null,startdate,enddate, options ).then( ( res:any ) => {
           console.log("res");
           
            console.log(res);
        }).catch((err:any ) => {
            console.log("err");
            
            console.log(err);
        })
    }

    timeChange(time) {
        console.log(time);
        this.chosenHours = time.hour;
        this.chosenMinutes = time.minute;
    }

    addNotifications() {

        let currentDate = new Date();
        let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.

        for (let day of this.days) {

            if (day.checked) {

                let firstNotificationTime = new Date();
                let dayDifference = day.dayCode - currentDay;

                if (dayDifference < 0) {
                    dayDifference = dayDifference + 7; // for cases where the day is in the following week
                }

                firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
                firstNotificationTime.setHours(this.chosenHours);
                firstNotificationTime.setMinutes(this.chosenMinutes);
                console.log("firstNotificationTime");
                console.log(firstNotificationTime);
                let notification = {
                    id: day.dayCode,
                    title: 'Hey!',
                    text: 'You just got notified :)',
                    at: firstNotificationTime,
                    every: 'week'
                };
                console.log("notification");
                console.log(notification);
                this.notifications.push(notification);

            }

        }

        console.log("Notifications to be scheduled: ", this.notifications);

        if (this.platform.is('cordova')) {

            // Cancel any existing notifications
            this.localNotifications.cancelAll().then(() => {

                // Schedule the new notifications
                this.localNotifications.schedule(this.notifications);

                this.notifications = [];

                let alert = this.alertCtrl.create({
                    title: 'Notifications set',
                    buttons: ['Ok']
                });

                alert.present();

            });

        }

    }

    cancelAll() {
        this.localNotifications.cancelAll();

        let alert = this.alertCtrl.create({
            title: 'Notifications cancelled',
            buttons: ['Ok']
        });

        alert.present();
    }


}
