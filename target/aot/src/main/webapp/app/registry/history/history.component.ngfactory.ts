/**
 * @fileoverview This file is generated by the Angular template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
 /* tslint:disable */


import * as import0 from '@angular/core';
import * as import1 from '@angular/common';
import * as import2 from '../../shared/refresh/refresh-selector.component.ngfactory';
import * as import3 from '../../../../../../../../src/main/webapp/app/shared/refresh/refresh-selector.component';
import * as import4 from '../../../../../../../../src/main/webapp/app/shared/refresh/refresh.service';
import * as import5 from '../../../../../../../../src/main/webapp/app/registry/history/history.component';
import * as import6 from '../../../../../../node_modules/@ng-bootstrap/ng-bootstrap/tabset/tabset.ngfactory';
import * as import7 from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import * as import8 from '@ng-bootstrap/ng-bootstrap/tabset/tabset-config';
import * as import9 from '../../../../../../../../src/main/webapp/app/registry/history/history.service';
const styles_JhiHistoryComponent:any[] = ([] as any[]);
export const RenderType_JhiHistoryComponent:import0.RendererType2 = import0.ɵcrt({
  encapsulation: 2,
  styles: styles_JhiHistoryComponent,
  data: {}
}
);
function View_JhiHistoryComponent_1(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[(l()(),import0.ɵand(0,(null as any),(null as any),0))],(null as any),(null as any));
}
function View_JhiHistoryComponent_2(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[(l()(),import0.ɵand(0,(null as any),(null as any),0))],(null as any),(null as any));
}
function View_JhiHistoryComponent_4(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[
    (l()(),import0.ɵeld(0,(null as any),(null as any),8,'tr',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n                        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),2,'td',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),[
      '\n                            ',
      '\n                        '
    ]
    )),
    import0.ɵppd(2),
    (l()(),import0.ɵted((null as any),['\n                        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'td',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),[
      '\n                            ',
      '\n                        '
    ]
    )),
    (l()(),import0.ɵted((null as any),['\n                    ']))
  ]
  ,(null as any),(ck,v) => {
    const currVal_0:any = import0.ɵunv(v,3,0,ck(v,4,0,import0.ɵnov(v.parent.parent,0),v.context.$implicit.key,'medium'));
    ck(v,3,0,currVal_0);
    const currVal_1:any = v.context.$implicit.value;
    ck(v,7,0,currVal_1);
  });
}
function View_JhiHistoryComponent_3(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[
    (l()(),import0.ɵeld(0,(null as any),(null as any),4,'tbody',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵand(8388608,(null as any),(null as any),1,(null as any),View_JhiHistoryComponent_4)),
    import0.ɵdid(401408,(null as any),0,import1.NgForOf,[
      import0.ViewContainerRef,
      import0.TemplateRef,
      import0.IterableDiffers
    ]
      ,{ngForOf: [
        0,
        'ngForOf'
      ]
    },(null as any)),
    (l()(),import0.ɵted((null as any),['\n                    ']))
  ]
  ,(ck,v) => {
    var co:any = v.component;
    const currVal_0:any = co.items;
    ck(v,3,0,currVal_0);
  },(null as any));
}
export function View_JhiHistoryComponent_0(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[
    import0.ɵpid(0,import1.DatePipe,[import0.LOCALE_ID]),
    (l()(),import0.ɵeld(0,(null as any),(null as any),60,'div',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n    '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),7,'div',[[
        'class',
        'head'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n        '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),1,'h2',[[
        'class',
        'd-inline-block'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Instances history'])),
    (l()(),import0.ɵted((null as any),['\n        '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),1,'jhi-refresh-selector',[[
        'class',
        'float-right refresh-left-side'
      ]
    ],(null as any),(null as any),(null as any),import2.View_JhiRefreshSelectorComponent_0,import2.RenderType_JhiRefreshSelectorComponent)),
    import0.ɵdid(122880,(null as any),0,import3.JhiRefreshSelectorComponent,[import4.JhiRefreshService],(null as any),(null as any)),
    (l()(),import0.ɵted((null as any),['\n    '])),
    (l()(),import0.ɵted((null as any),['\n\n    '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),48,'div',[[
        'class',
        'panel panel-default'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n        '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),45,'div',[[
        'class',
        'panel-body'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n            '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),21,'ngb-tabset',[[
        'activeId',
        'registered'
      ]
      ],(null as any),[[
        (null as any),
        'tabChange'
      ]
    ],(v,en,$event) => {
      var ad:boolean = true;
      var co:import5.JhiHistoryComponent = v.component;
      if (('tabChange' === en)) {
        const pd_0:any = ((<any>co.beforeChange($event)) !== false);
        ad = (pd_0 && ad);
      }
      return ad;
    },import6.View_NgbTabset_0,import6.RenderType_NgbTabset)),
      import0.ɵdid(1073152,(null as any),1,import7.NgbTabset,[import8.NgbTabsetConfig],{activeId: [
        0,
        'activeId'
      ]
    },{tabChange: 'tabChange'}),
    import0.ɵqud(301989888,1,{tabs: 1}),
    (l()(),import0.ɵted((null as any),['\n                '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),7,'ngb-tab',[
      [
        'id',
        'registered'
      ]
      ,
      [
        'title',
        'Last registered leases'
      ]

    ]
    ,(null as any),(null as any),(null as any),(null as any),(null as any))),
      import0.ɵdid(8192,[[
        1,
        4
      ]
    ],2,import7.NgbTab,([] as any[]),{
      id: [
        0,
        'id'
      ]
      ,
      title: [
        1,
        'title'
      ]

    }
    ,(null as any)),
    import0.ɵqud(167772160,2,{contentTpl: 0}),
    import0.ɵqud(167772160,3,{titleTpl: 0}),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵand(0,(null as any),(null as any),1,(null as any),View_JhiHistoryComponent_1)),
      import0.ɵdid(8192,[[
        2,
        4
      ]
    ],0,import7.NgbTabContent,[import0.TemplateRef],(null as any),(null as any)),
    (l()(),import0.ɵted((null as any),['\n                '])),
    (l()(),import0.ɵted((null as any),['\n                '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),7,'ngb-tab',[
      [
        'id',
        'canceled'
      ]
      ,
      [
        'title',
        'Last canceled leases'
      ]

    ]
    ,(null as any),(null as any),(null as any),(null as any),(null as any))),
      import0.ɵdid(8192,[[
        1,
        4
      ]
    ],2,import7.NgbTab,([] as any[]),{
      id: [
        0,
        'id'
      ]
      ,
      title: [
        1,
        'title'
      ]

    }
    ,(null as any)),
    import0.ɵqud(167772160,4,{contentTpl: 0}),
    import0.ɵqud(167772160,5,{titleTpl: 0}),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵand(0,(null as any),(null as any),1,(null as any),View_JhiHistoryComponent_2)),
      import0.ɵdid(8192,[[
        4,
        4
      ]
    ],0,import7.NgbTabContent,[import0.TemplateRef],(null as any),(null as any)),
    (l()(),import0.ɵted((null as any),['\n                '])),
    (l()(),import0.ɵted((null as any),['\n            '])),
    (l()(),import0.ɵted((null as any),['\n            '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),19,'div',[[
        'class',
        'table-responsive'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n                '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),16,'table',[[
        'class',
        'table table-striped'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),10,'thead',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),7,'tr',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n                        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'th',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Time'])),
    (l()(),import0.ɵted((null as any),['\n                        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'th',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Instance'])),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵand(8388608,(null as any),(null as any),1,(null as any),View_JhiHistoryComponent_3)),
    import0.ɵdid(8192,(null as any),0,import1.NgIf,[
      import0.ViewContainerRef,
      import0.TemplateRef
    ]
      ,{ngIf: [
        0,
        'ngIf'
      ]
    },(null as any)),
    (l()(),import0.ɵted((null as any),['\n                '])),
    (l()(),import0.ɵted((null as any),['\n            '])),
    (l()(),import0.ɵted((null as any),['\n        '])),
    (l()(),import0.ɵted((null as any),['\n    '])),
    (l()(),import0.ɵted((null as any),['\n'])),
    (l()(),import0.ɵted((null as any),['\n']))
  ]
  ,(ck,v) => {
    var co:import5.JhiHistoryComponent = v.component;
    ck(v,9,0);
    const currVal_0:any = 'registered';
    ck(v,17,0,currVal_0);
    const currVal_1:any = 'registered';
    const currVal_2:any = 'Last registered leases';
    ck(v,21,0,currVal_1,currVal_2);
    const currVal_3:any = 'canceled';
    const currVal_4:any = 'Last canceled leases';
    ck(v,30,0,currVal_3,currVal_4);
    const currVal_5:any = co.items;
    ck(v,56,0,currVal_5);
  },(null as any));
}
function View_JhiHistoryComponent_Host_0(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'jhi-history',([] as any[]),(null as any),(null as any),(null as any),View_JhiHistoryComponent_0,RenderType_JhiHistoryComponent)),
    import0.ɵdid(122880,(null as any),0,import5.JhiHistoryComponent,[
      import9.JhiHistoryService,
      import4.JhiRefreshService
    ]
    ,(null as any),(null as any))
  ]
  ,(ck,v) => {
    ck(v,1,0);
  },(null as any));
}
export const JhiHistoryComponentNgFactory:import0.ComponentFactory<import5.JhiHistoryComponent> = import0.ɵccf('jhi-history',import5.JhiHistoryComponent,View_JhiHistoryComponent_Host_0,{},{},([] as any[]));
//# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiL1VzZXJzL3lvbmF0aGFua2ViZS9Xb3Jrc3BhY2VzMS9PRE9TSUlSZWdpc3RyeV9sYXRlc3QvamhpcHN0ZXJfcmVnaXN0cnkvc3JjL21haW4vd2ViYXBwL2FwcC9yZWdpc3RyeS9oaXN0b3J5L2hpc3RvcnkuY29tcG9uZW50Lm5nZmFjdG9yeS50cyIsInZlcnNpb24iOjMsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5nOi8vL1VzZXJzL3lvbmF0aGFua2ViZS9Xb3Jrc3BhY2VzMS9PRE9TSUlSZWdpc3RyeV9sYXRlc3QvamhpcHN0ZXJfcmVnaXN0cnkvc3JjL21haW4vd2ViYXBwL2FwcC9yZWdpc3RyeS9oaXN0b3J5L2hpc3RvcnkuY29tcG9uZW50LnRzIiwibmc6Ly8vVXNlcnMveW9uYXRoYW5rZWJlL1dvcmtzcGFjZXMxL09ET1NJSVJlZ2lzdHJ5X2xhdGVzdC9qaGlwc3Rlcl9yZWdpc3RyeS9zcmMvbWFpbi93ZWJhcHAvYXBwL3JlZ2lzdHJ5L2hpc3RvcnkvaGlzdG9yeS5jb21wb25lbnQuaHRtbCIsIm5nOi8vL1VzZXJzL3lvbmF0aGFua2ViZS9Xb3Jrc3BhY2VzMS9PRE9TSUlSZWdpc3RyeV9sYXRlc3QvamhpcHN0ZXJfcmVnaXN0cnkvc3JjL21haW4vd2ViYXBwL2FwcC9yZWdpc3RyeS9oaXN0b3J5L2hpc3RvcnkuY29tcG9uZW50LnRzLkpoaUhpc3RvcnlDb21wb25lbnRfSG9zdC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIiAiLCI8ZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJoZWFkXCI+XG4gICAgICAgIDxoMiBjbGFzcz1cImQtaW5saW5lLWJsb2NrXCI+SW5zdGFuY2VzIGhpc3Rvcnk8L2gyPlxuICAgICAgICA8amhpLXJlZnJlc2gtc2VsZWN0b3IgY2xhc3M9XCJmbG9hdC1yaWdodCByZWZyZXNoLWxlZnQtc2lkZVwiPjwvamhpLXJlZnJlc2gtc2VsZWN0b3I+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxuICAgICAgICAgICAgPG5nYi10YWJzZXQgYWN0aXZlSWQ9XCJyZWdpc3RlcmVkXCIgKHRhYkNoYW5nZSk9XCJiZWZvcmVDaGFuZ2UoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgIDxuZ2ItdGFiIGlkPVwicmVnaXN0ZXJlZFwiIHRpdGxlPVwiTGFzdCByZWdpc3RlcmVkIGxlYXNlc1wiPlxuICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgbmdiVGFiQ29udGVudD48L3RlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvbmdiLXRhYj5cbiAgICAgICAgICAgICAgICA8bmdiLXRhYiBpZD1cImNhbmNlbGVkXCIgdGl0bGU9XCJMYXN0IGNhbmNlbGVkIGxlYXNlc1wiPlxuICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgbmdiVGFiQ29udGVudD48L3RlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvbmdiLXRhYj5cbiAgICAgICAgICAgIDwvbmdiLXRhYnNldD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZS1yZXNwb25zaXZlXCI+XG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZFwiPlxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5UaW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5JbnN0YW5jZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keSAqbmdJZj1cIml0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0ciAqbmdGb3I9XCJsZXQgaW5zdGFuY2Ugb2YgaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2luc3RhbmNlLmtleSB8IGRhdGU6J21lZGl1bSd9fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7e2luc3RhbmNlLnZhbHVlfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuIiwiPGpoaS1oaXN0b3J5PjwvamhpLWhpc3Rvcnk+Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDeUJvQjtJQUFtQztJQUMvQjtJQUFJO01BQUE7TUFBQTtJQUFBO0lBQUE7Z0JBQUE7SUFFQztJQUNMO0lBQUk7TUFBQTtNQUFBO0lBQUE7SUFBQTtJQUVDOzs7SUFMRDtJQUFBO0lBR0E7SUFBQTs7Ozs7SUFMUjtJQUFxQjtJQUNyQjtnQkFBQTs7OztJQUFBO09BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtJQU9LOzs7O0lBUEQ7SUFBSixTQUFJLFNBQUo7Ozs7OztJQXpCcEI7SUFBSztNQUNEO1FBQUE7UUFBQTtNQUFBO0lBQUE7SUFBa0I7TUFDZDtRQUFBO1FBQUE7TUFBQTtJQUFBO0lBQTJCO0lBQXNCO01BQ2pEO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7SUFBbUY7SUFDakY7TUFFTjtRQUFBO1FBQUE7TUFBQTtJQUFBO0lBQWlDO01BQzdCO1FBQUE7UUFBQTtNQUFBO0lBQUE7SUFBd0I7TUFDcEI7UUFBQTtRQUFBO01BQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO01BQUE7TUFBQTtNQUFrQztRQUFBO1FBQUE7TUFBQTtNQUFsQztJQUFBO2tCQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7Z0JBQUE7SUFBcUU7SUFDakU7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO2tCQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO2dCQUFBO2dCQUFBO0lBQXdEO0lBQ3BEO2tCQUFBO1FBQUE7UUFBQTtNQUFBO0lBQUE7SUFBbUM7SUFDN0I7SUFDVjtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7a0JBQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtNQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtNQUFBOztJQUFBO0tBQUE7Z0JBQUE7Z0JBQUE7SUFBb0Q7SUFDaEQ7a0JBQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUFtQztJQUM3QjtJQUNEO01BQ2I7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUE4QjtNQUMxQjtRQUFBO1FBQUE7TUFBQTtJQUFBO0lBQW1DO0lBQy9CO0lBQU87SUFDUDtJQUFJO0lBQ0E7SUFBSTtJQUFTO0lBQ2I7SUFBSTtJQUFhO0lBQ2hCO0lBQ0c7SUFDUjtnQkFBQTs7O0lBQUE7T0FBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO0lBU1E7SUFDSjtJQUNOO0lBQ0o7SUFDSjtJQUNKOzs7O0lBbkNFO0lBS2dCO0lBQVosVUFBWSxTQUFaO0lBQ2E7SUFBZ0I7SUFBekIsVUFBUyxVQUFnQixTQUF6QjtJQUdTO0lBQWM7SUFBdkIsVUFBUyxVQUFjLFNBQXZCO0lBWVc7SUFBUCxVQUFPLFNBQVA7Ozs7O0lDeEJwQjtnQkFBQTs7O0lBQUE7S0FBQTs7O0lBQUE7OzsifQ==
