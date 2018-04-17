/**
 * @fileoverview This file is generated by the Angular template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
 /* tslint:disable */


import * as import0 from '@angular/core';
import * as import1 from '../../../../../../../../src/main/webapp/app/registry/ssh/ssh.component';
import * as import2 from '@angular/common';
import * as import3 from '@ng-bootstrap/ng-bootstrap/collapse/collapse';
import * as import4 from '../../../../../../../../src/main/webapp/app/registry/ssh/ssh.service';
const styles_JhiSSHComponent:any[] = ([] as any[]);
export const RenderType_JhiSSHComponent:import0.RendererType2 = import0.ɵcrt({
  encapsulation: 2,
  styles: styles_JhiSSHComponent,
  data: {}
}
);
function View_JhiSSHComponent_1(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[
    (l()(),import0.ɵeld(0,(null as any),(null as any),3,'span',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n                '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),0,'span',[[
        'class',
        'fa fa-arrow-circle-down'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),[' show more\n            ']))
  ]
  ,(null as any),(null as any));
}
function View_JhiSSHComponent_2(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[
    (l()(),import0.ɵeld(0,(null as any),(null as any),3,'span',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n                '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),0,'span',[[
        'class',
        'fa fa-arrow-circle-up'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),[' show less\n            ']))
  ]
  ,(null as any),(null as any));
}
export function View_JhiSSHComponent_0(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[
    (l()(),import0.ɵeld(0,(null as any),(null as any),97,'div',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'h2',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['SSH Public Key'])),
    (l()(),import0.ɵted((null as any),['\n\n    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),4,'p',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n        This is the SSH public key stored in this server\'s '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'code',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['~/.ssh/id_rsa.pub'])),
    (l()(),import0.ɵted((null as any),['\n    '])),
    (l()(),import0.ɵted((null as any),['\n    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'p',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n        This key should be used to grant access for this server to the Git repository which holds the Spring Cloud Configuration files.\n    '])),
    (l()(),import0.ɵted((null as any),['\n\n    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'h3',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Your SSH public key'])),
    (l()(),import0.ɵted((null as any),['\n\n    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'pre',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),[
      '',
      ''
    ]
    )),
    (l()(),import0.ɵted((null as any),['\n    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),0,'hr',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n    '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),10,'div',[[
        'class',
        'text-center pad'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n        '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),7,'a',[[
        'class',
        'btn btn-default'
      ]
      ],(null as any),[[
        (null as any),
        'click'
      ]
    ],(v,en,$event) => {
      var ad:boolean = true;
      var co:import1.JhiSSHComponent = v.component;
      if (('click' === en)) {
        const pd_0:any = ((<any>(co.showMore = !co.showMore)) !== false);
        ad = (pd_0 && ad);
      }
      return ad;
    },(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n            '])),
    (l()(),import0.ɵand(8388608,(null as any),(null as any),1,(null as any),View_JhiSSHComponent_1)),
    import0.ɵdid(8192,(null as any),0,import2.NgIf,[
      import0.ViewContainerRef,
      import0.TemplateRef
    ]
      ,{ngIf: [
        0,
        'ngIf'
      ]
    },(null as any)),
    (l()(),import0.ɵted((null as any),['\n        '])),
    (l()(),import0.ɵand(8388608,(null as any),(null as any),1,(null as any),View_JhiSSHComponent_2)),
    import0.ɵdid(8192,(null as any),0,import2.NgIf,[
      import0.ViewContainerRef,
      import0.TemplateRef
    ]
      ,{ngIf: [
        0,
        'ngIf'
      ]
    },(null as any)),
    (l()(),import0.ɵted((null as any),['\n        '])),
    (l()(),import0.ɵted((null as any),['\n    '])),
    (l()(),import0.ɵted((null as any),['\n	'])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),62,'div',([] as any[]),[
      [
        2,
        'collapse',
        (null as any)
      ]
      ,
      [
        2,
        'show',
        (null as any)
      ]
      ,
      [
        1,
        'aria-expanded',
        0
      ]

    ]
    ,(null as any),(null as any),(null as any),(null as any))),
      import0.ɵdid(8192,(null as any),0,import3.NgbCollapse,([] as any[]),{collapsed: [
        0,
        'collapsed'
      ]
    },(null as any)),
    (l()(),import0.ɵted((null as any),['\n        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),2,'h3',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
      (l()(),import0.ɵeld(0,(null as any),(null as any),0,'span',[[
        'class',
        'fa fa-info-circle'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),[' Using SSH with Docker'])),
    (l()(),import0.ɵted((null as any),['\n        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),4,'p',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n            Here are detailed instruction when using the JHipster Registry Docker image, available at\n            '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'a',[
      [
        'href',
        'https://hub.docker.com/r/jhipster/jhipster-registry/'
      ]
      ,
      [
        'target',
        '_blank'
      ]

    ]
    ,(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['jhipster/jhipster-registry/'])),
    (l()(),import0.ɵted((null as any),['.\n        '])),
    (l()(),import0.ɵted((null as any),['\n\n        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),36,'ul',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n            '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),3,'li',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Log in inside the container: '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'code',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['docker exec -it <containerIdOrName> sh'])),
    (l()(),import0.ɵted((null as any),['\n            '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),3,'li',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Generate an SSH key: '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'code',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['ssh-keygen'])),
    (l()(),import0.ɵted((null as any),['\n            '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),4,'li',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Copy the public key in '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'code',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['/root/.ssh/id_rsa.pub'])),
    (l()(),import0.ɵted((null as any),[' to the remote Git repository you want to access\n                (in Github, go to your settings/SSH keys)'])),
    (l()(),import0.ɵted((null as any),['\n            '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),14,'li',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Test inside your container that the SSH connection is working:\n                '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),11,'ul',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),3,'li',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Log in to your Git provider using your ssh key: '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'code',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['ssh -T git@github.com'])),
    (l()(),import0.ɵted((null as any),['\n                    '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),3,'li',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['When asked to to add the Git repository host to the list of known hosts, reply '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'b',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['yes'])),
    (l()(),import0.ɵted((null as any),['\n                '])),
    (l()(),import0.ɵted((null as any),['\n            '])),
    (l()(),import0.ɵted((null as any),['\n            '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'li',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['Restart the registry without removing the container, it should be able to read a Git repo secured by SSH'])),
    (l()(),import0.ɵted((null as any),['\n        '])),
    (l()(),import0.ɵted((null as any),['\n\n        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),4,'p',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['\n        In order not to lose our setup every time you recreate or update the container, you can mount the\n        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'code',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['/root/.ssh/'])),
    (l()(),import0.ɵted((null as any),[' folder to a Docker volume.\n        '])),
    (l()(),import0.ɵted((null as any),['\n\n        '])),
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'p',([] as any[]),(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['To setup your own git repo, edit the GIT_URI environment variable passed to your container, for example using Docker Compose:'])),
    (l()(),import0.ɵted((null as any),['\n        '])),
      (l()(),import0.ɵeld(0,(null as any),(null as any),1,'pre',[[
        'class',
        'code-block'
      ]
    ],(null as any),(null as any),(null as any),(null as any),(null as any))),
    (l()(),import0.ɵted((null as any),['    version: \'2\'\n      services:\n        jhipster-registry:\n          container_name: jhipster-registry\n          image: jhipster/jhipster-registry\n      volumes:\n        - ./ssh/:/root/.ssh/\n      environment:\n        - SPRING_PROFILES_ACTIVE=prod\n        - GIT_URI=git@github.com:jhipster/jhipster-registry.git\n        - GIT_SEARCH_PATHS=central-config\n      ports:\n        - 8761:8761\n        '])),
    (l()(),import0.ɵted((null as any),['\n	'])),
    (l()(),import0.ɵted((null as any),['\n'])),
    (l()(),import0.ɵted((null as any),['\n']))
  ]
  ,(ck,v) => {
    var co:import1.JhiSSHComponent = v.component;
    const currVal_1:any = co.showMore;
    ck(v,27,0,currVal_1);
    const currVal_2:boolean = !co.showMore;
    ck(v,30,0,currVal_2);
    const currVal_6:any = co.showMore;
    ck(v,35,0,currVal_6);
  },(ck,v) => {
    var co:import1.JhiSSHComponent = v.component;
    const currVal_0:any = co.data;
    ck(v,18,0,currVal_0);
    const currVal_3:any = true;
    const currVal_4:boolean = !import0.ɵnov(v,35).collapsed;
    const currVal_5:boolean = !import0.ɵnov(v,35).collapsed;
    ck(v,34,0,currVal_3,currVal_4,currVal_5);
  });
}
function View_JhiSSHComponent_Host_0(l:any):import0.ɵViewDefinition {
  return import0.ɵvid(0,[
    (l()(),import0.ɵeld(0,(null as any),(null as any),1,'jhi-applications',([] as any[]),(null as any),(null as any),(null as any),View_JhiSSHComponent_0,RenderType_JhiSSHComponent)),
    import0.ɵdid(57344,(null as any),0,import1.JhiSSHComponent,[import4.JhiSSHService],(null as any),(null as any))
  ]
  ,(ck,v) => {
    ck(v,1,0);
  },(null as any));
}
export const JhiSSHComponentNgFactory:import0.ComponentFactory<import1.JhiSSHComponent> = import0.ɵccf('jhi-applications',import1.JhiSSHComponent,View_JhiSSHComponent_Host_0,{},{},([] as any[]));
//# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoiL1VzZXJzL3lvbmF0aGFua2ViZS9Xb3Jrc3BhY2VzMS9PRE9TSUlSZWdpc3RyeV9sYXRlc3QvamhpcHN0ZXJfcmVnaXN0cnkvc3JjL21haW4vd2ViYXBwL2FwcC9yZWdpc3RyeS9zc2gvc3NoLmNvbXBvbmVudC5uZ2ZhY3RvcnkudHMiLCJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzovLy9Vc2Vycy95b25hdGhhbmtlYmUvV29ya3NwYWNlczEvT0RPU0lJUmVnaXN0cnlfbGF0ZXN0L2poaXBzdGVyX3JlZ2lzdHJ5L3NyYy9tYWluL3dlYmFwcC9hcHAvcmVnaXN0cnkvc3NoL3NzaC5jb21wb25lbnQudHMiLCJuZzovLy9Vc2Vycy95b25hdGhhbmtlYmUvV29ya3NwYWNlczEvT0RPU0lJUmVnaXN0cnlfbGF0ZXN0L2poaXBzdGVyX3JlZ2lzdHJ5L3NyYy9tYWluL3dlYmFwcC9hcHAvcmVnaXN0cnkvc3NoL3NzaC5jb21wb25lbnQuaHRtbCIsIm5nOi8vL1VzZXJzL3lvbmF0aGFua2ViZS9Xb3Jrc3BhY2VzMS9PRE9TSUlSZWdpc3RyeV9sYXRlc3QvamhpcHN0ZXJfcmVnaXN0cnkvc3JjL21haW4vd2ViYXBwL2FwcC9yZWdpc3RyeS9zc2gvc3NoLmNvbXBvbmVudC50cy5KaGlTU0hDb21wb25lbnRfSG9zdC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIiAiLCI8ZGl2PlxuICAgIDxoMj5TU0ggUHVibGljIEtleTwvaDI+XG5cbiAgICA8cD5cbiAgICAgICAgVGhpcyBpcyB0aGUgU1NIIHB1YmxpYyBrZXkgc3RvcmVkIGluIHRoaXMgc2VydmVyJ3MgPGNvZGU+JiMxMjY7Ly5zc2gvaWRfcnNhLnB1YjwvY29kZT5cbiAgICA8L3A+XG4gICAgPHA+XG4gICAgICAgIFRoaXMga2V5IHNob3VsZCBiZSB1c2VkIHRvIGdyYW50IGFjY2VzcyBmb3IgdGhpcyBzZXJ2ZXIgdG8gdGhlIEdpdCByZXBvc2l0b3J5IHdoaWNoIGhvbGRzIHRoZSBTcHJpbmcgQ2xvdWQgQ29uZmlndXJhdGlvbiBmaWxlcy5cbiAgICA8L3A+XG5cbiAgICA8aDM+WW91ciBTU0ggcHVibGljIGtleTwvaDM+XG5cbiAgICA8cHJlPnt7ZGF0YX19PC9wcmU+XG4gICAgPGhyPlxuICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlciBwYWRcIiA+XG4gICAgICAgIDxhIChjbGljayk9XCJzaG93TW9yZSA9ICFzaG93TW9yZVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+XG4gICAgICAgICAgICA8c3BhbiAqbmdJZj1cInNob3dNb3JlXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmYSBmYS1hcnJvdy1jaXJjbGUtZG93blwiPjwvc3Bhbj4mbmJzcDtzaG93IG1vcmVcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCIhc2hvd01vcmVcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZhIGZhLWFycm93LWNpcmNsZS11cFwiPjwvc3Bhbj4mbmJzcDtzaG93IGxlc3NcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgIDwvZGl2PlxuXHQ8ZGl2IFtuZ2JDb2xsYXBzZV09XCJzaG93TW9yZVwiPlxuICAgICAgICA8aDM+PHNwYW4gY2xhc3M9XCJmYSBmYS1pbmZvLWNpcmNsZVwiPjwvc3Bhbj4gVXNpbmcgU1NIIHdpdGggRG9ja2VyPC9oMz5cbiAgICAgICAgPHA+XG4gICAgICAgICAgICBIZXJlIGFyZSBkZXRhaWxlZCBpbnN0cnVjdGlvbiB3aGVuIHVzaW5nIHRoZSBKSGlwc3RlciBSZWdpc3RyeSBEb2NrZXIgaW1hZ2UsIGF2YWlsYWJsZSBhdFxuICAgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vaHViLmRvY2tlci5jb20vci9qaGlwc3Rlci9qaGlwc3Rlci1yZWdpc3RyeS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5qaGlwc3Rlci9qaGlwc3Rlci1yZWdpc3RyeS88L2E+LlxuICAgICAgICA8L3A+XG5cbiAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPkxvZyBpbiBpbnNpZGUgdGhlIGNvbnRhaW5lcjogPGNvZGU+ZG9ja2VyIGV4ZWMgLWl0ICZsdDtjb250YWluZXJJZE9yTmFtZSZndDsgc2g8L2NvZGU+PC9saT5cbiAgICAgICAgICAgIDxsaT5HZW5lcmF0ZSBhbiBTU0gga2V5OiA8Y29kZT5zc2gta2V5Z2VuPC9jb2RlPjwvbGk+XG4gICAgICAgICAgICA8bGk+Q29weSB0aGUgcHVibGljIGtleSBpbiA8Y29kZT4vcm9vdC8uc3NoL2lkX3JzYS5wdWI8L2NvZGU+IHRvIHRoZSByZW1vdGUgR2l0IHJlcG9zaXRvcnkgeW91IHdhbnQgdG8gYWNjZXNzXG4gICAgICAgICAgICAgICAgKGluIEdpdGh1YiwgZ28gdG8geW91ciBzZXR0aW5ncy9TU0gga2V5cyk8L2xpPlxuICAgICAgICAgICAgPGxpPlRlc3QgaW5zaWRlIHlvdXIgY29udGFpbmVyIHRoYXQgdGhlIFNTSCBjb25uZWN0aW9uIGlzIHdvcmtpbmc6XG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICA8bGk+TG9nIGluIHRvIHlvdXIgR2l0IHByb3ZpZGVyIHVzaW5nIHlvdXIgc3NoIGtleTogPGNvZGU+c3NoIC1UIGdpdEBnaXRodWIuY29tPC9jb2RlPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT5XaGVuIGFza2VkIHRvIHRvIGFkZCB0aGUgR2l0IHJlcG9zaXRvcnkgaG9zdCB0byB0aGUgbGlzdCBvZiBrbm93biBob3N0cywgcmVwbHkgPGI+eWVzPC9iPjwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8bGk+UmVzdGFydCB0aGUgcmVnaXN0cnkgd2l0aG91dCByZW1vdmluZyB0aGUgY29udGFpbmVyLCBpdCBzaG91bGQgYmUgYWJsZSB0byByZWFkIGEgR2l0IHJlcG8gc2VjdXJlZCBieSBTU0g8L2xpPlxuICAgICAgICA8L3VsPlxuXG4gICAgICAgIDxwPlxuICAgICAgICBJbiBvcmRlciBub3QgdG8gbG9zZSBvdXIgc2V0dXAgZXZlcnkgdGltZSB5b3UgcmVjcmVhdGUgb3IgdXBkYXRlIHRoZSBjb250YWluZXIsIHlvdSBjYW4gbW91bnQgdGhlXG4gICAgICAgIDxjb2RlPi9yb290Ly5zc2gvPC9jb2RlPiBmb2xkZXIgdG8gYSBEb2NrZXIgdm9sdW1lLlxuICAgICAgICA8L3A+XG5cbiAgICAgICAgPHA+VG8gc2V0dXAgeW91ciBvd24gZ2l0IHJlcG8sIGVkaXQgdGhlIEdJVF9VUkkgZW52aXJvbm1lbnQgdmFyaWFibGUgcGFzc2VkIHRvIHlvdXIgY29udGFpbmVyLCBmb3IgZXhhbXBsZSB1c2luZyBEb2NrZXIgQ29tcG9zZTo8L3A+XG4gICAgICAgIDxwcmUgY2xhc3M9XCJjb2RlLWJsb2NrXCI+XG4gICAgdmVyc2lvbjogJzInXG4gICAgICBzZXJ2aWNlczpcbiAgICAgICAgamhpcHN0ZXItcmVnaXN0cnk6XG4gICAgICAgICAgY29udGFpbmVyX25hbWU6IGpoaXBzdGVyLXJlZ2lzdHJ5XG4gICAgICAgICAgaW1hZ2U6IGpoaXBzdGVyL2poaXBzdGVyLXJlZ2lzdHJ5XG4gICAgICB2b2x1bWVzOlxuICAgICAgICAtIC4vc3NoLzovcm9vdC8uc3NoL1xuICAgICAgZW52aXJvbm1lbnQ6XG4gICAgICAgIC0gU1BSSU5HX1BST0ZJTEVTX0FDVElWRT1wcm9kXG4gICAgICAgIC0gR0lUX1VSST1naXRAZ2l0aHViLmNvbTpqaGlwc3Rlci9qaGlwc3Rlci1yZWdpc3RyeS5naXRcbiAgICAgICAgLSBHSVRfU0VBUkNIX1BBVEhTPWNlbnRyYWwtY29uZmlnXG4gICAgICBwb3J0czpcbiAgICAgICAgLSA4NzYxOjg3NjFcbiAgICAgICAgPC9wcmU+XG5cdDwvZGl2PlxuPC9kaXY+XG4iLCI8amhpLWFwcGxpY2F0aW9ucz48L2poaS1hcHBsaWNhdGlvbnM+Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2dCWTtJQUF1QjtNQUNuQjtRQUFBO1FBQUE7TUFBQTtJQUFBO0lBQTZDOzs7Ozs7SUFFckQ7SUFBd0I7TUFDaEI7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUEyQzs7Ozs7O0lBcEIzRDtJQUFLO0lBQ0Q7SUFBSTtJQUFtQjtJQUV2QjtJQUFHO0lBQ29EO0lBQU07SUFBNkI7SUFDdEY7SUFDSjtJQUFHO0lBRUM7SUFFSjtJQUFJO0lBQXdCO0lBRTVCO0lBQUs7TUFBQTtNQUFBO0lBQUE7SUFBQTtJQUFjO0lBQ25CO0lBQUk7TUFDSjtRQUFBO1FBQUE7TUFBQTtJQUFBO0lBQThCO01BQzFCO1FBQUE7UUFBQTtNQUFBO01BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtNQUFBO01BQUE7TUFBRztRQUFBO1FBQUE7TUFBQTtNQUFIO0lBQUE7SUFBMEQ7SUFDdEQ7Z0JBQUE7OztJQUFBO09BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUVPO0lBQ1g7Z0JBQUE7OztJQUFBO09BQUE7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUVXO0lBQ1A7SUFDRjtJQUNUO01BQUE7UUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7UUFBQTtNQUFBOztNQUFBO1FBQUE7UUFBQTtRQUFBO01BQUE7O0lBQUE7S0FBQTtrQkFBQTtRQUFBO1FBQUE7TUFBQTtJQUFBO0lBQThCO0lBQ3ZCO01BQUk7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUF1QztJQUEyQjtJQUN0RTtJQUFHO0lBRUM7TUFBQTtRQUFBO1FBQUE7TUFBQTs7TUFBQTtRQUFBO1FBQUE7TUFBQTs7SUFBQTtLQUFBO0lBQStFO0lBQStCO0lBQzlHO0lBRUo7SUFBSTtJQUNBO0lBQUk7SUFBNkI7SUFBTTtJQUF3RDtJQUMvRjtJQUFJO0lBQXFCO0lBQU07SUFBc0I7SUFDckQ7SUFBSTtJQUF1QjtJQUFNO0lBQTRCO0lBQ1g7SUFDbEQ7SUFBSTtJQUNBO0lBQUk7SUFDQTtJQUFJO0lBQWdEO0lBQU07SUFBaUM7SUFDM0Y7SUFBSTtJQUErRTtJQUFHO0lBQVk7SUFDakc7SUFDSjtJQUNMO0lBQUk7SUFBNkc7SUFDaEg7SUFFTDtJQUFHO0lBRUg7SUFBTTtJQUFrQjtJQUNwQjtJQUVKO0lBQUc7SUFBaUk7TUFDcEk7UUFBQTtRQUFBO01BQUE7SUFBQTtJQUF3QjtJQWNsQjtJQUNQO0lBQ0Q7Ozs7SUFuRFk7SUFBTixVQUFNLFNBQU47SUFHRTtJQUFOLFVBQU0sU0FBTjtJQUtGO0lBQUwsVUFBSyxTQUFMOzs7SUFaUTtJQUFBO0lBWVI7SUFBQTtJQUFBO0lBQUEsVUFBQSw2QkFBQTs7Ozs7SUN4QkQ7Z0JBQUE7OztJQUFBOzs7In0=
