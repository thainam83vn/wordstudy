import { Component, ViewChild  } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen, Transfer } from 'ionic-native';
import { MainPage } from '../pages/main/main';
import { MyWordsPage } from '../pages/mywords/mywords';
import { OrderByWordPipe } from '../services/orderby-word';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  pages:any[];
  rootPage = MainPage;

  constructor(public platform: Platform,  public menu: MenuController) {
    this.pages = [
      { image:'assets/icon/search-earth.png', title: 'Browse Word', component: MainPage },
      { image:'assets/icon/my-words.png', title: 'My Words', component: MyWordsPage }
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
