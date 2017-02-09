import { ViewChild,Component,OnDestroy,ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscription }   from 'rxjs/Subscription';
import { MqttService } from '../../mqtt-service';
import { jqxGaugeComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgauge';

@Component({
  //selector: 'page-gauge',
  //templateUrl: 'gauge.html'
  selector: 'gauge',
    template: `
      <jqxGauge #gaugeReference (onValueChanging)="gaugeOnValueChanging($event)"
          [ranges]='ranges' [ticksMinor]='ticksMinor' [ticksMajor]='ticksMajor'
          [value]='0' [colorScheme]='"scheme05"' [animationDuration]='1200'>
      </jqxGauge>
      <div #gaugeValue
          style="position: absolute; top: -140px; left: 124px; font-family: Sans-Serif; text-align: center; font-size: 17px; width: 100px;">0 &#8457;
      </div>`,
    styles:[`
      #gaugeValue {
          background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #fafafa), color-stop(100%, #f3f3f3));
          background-image: -webkit-linear-gradient(#fafafa, #f3f3f3);
          background-image: -moz-linear-gradient(#fafafa, #f3f3f3);
          background-image: -o-linear-gradient(#fafafa, #f3f3f3);
          background-image: -ms-linear-gradient(#fafafa, #f3f3f3);
          background-image: linear-gradient(#fafafa, #f3f3f3);
          -webkit-border-radius: 3px;
          -moz-border-radius: 3px;
          -ms-border-radius: 3px;
          -o-border-radius: 3px;
          border-radius: 3px;
          -webkit-box-shadow: 0 0 50px rgba(0, 0, 0, 0.2);
          -moz-box-shadow: 0 0 50px rgba(0, 0, 0, 0.2);
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.2);
          padding: 10px;
      }`
   ]
 
})
export class GaugePage implements OnDestroy{

  @ViewChild('gaugeReference') myGauge: jqxGaugeComponent;
  @ViewChild('gaugeValue')inputNumber:ElementRef;
  subscription:Subscription;
  ticksMinor: any = { interval: 5, size: '5%' };
  ticksMajor: any = { interval: 10, size: '9%' };
  ranges: any[] =
  [
      { startValue: 0, endValue: 55, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 5, startWidth: 1 },
      { startValue: 55, endValue: 110, style: { fill: '#fbd109', stroke: '#fbd109' }, endWidth: 10, startWidth: 5 },
      { startValue: 110, endValue: 165, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 13, startWidth: 10 },
      { startValue: 165, endValue: 220, style: { fill: '#e02629', stroke: '#e02629' }, endWidth: 16, startWidth: 13 }
  ];
  constructor(public navCtrl: NavController,private mqttService:MqttService) {

	  this.subscription= mqttService.publishUpdated$.subscribe(
      rand_num => {
        this.myGauge.value(rand_num);
      });
  	
  }

  ionViewDidLoad() {
    console.log('Hello GaugePage Page');
    
  }
  ngAfterViewInit(): void
  {
  	let self=this;
      setTimeout(() =>
      {
          self.myGauge.value(0);
      });   
  }
  gaugeOnValueChanging(event: any): void
  {
      //let gaugeValueDom = <HTMLElement>document.getElementById('gaugeValue');
      //gaugeValueDom.innerHTML = Math.round(event.args.value) + ' &#8457;';
      this.inputNumber.nativeElement.innerHTML=Math.round(event.args.value) + ' &#8457;';
  }
  

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}

