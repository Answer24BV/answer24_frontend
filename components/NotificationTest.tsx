"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { tokenUtils } from '@/utils/auth';
import { Bell, TestTube } from 'lucide-react';
import { toast } from 'react-hot-toast';

const NotificationTest: React.FC = () => {
  const user = tokenUtils.getUser();
  const { sendTestNotification } = usePushNotifications(user?.id);

  const handleTestNotification = () => {
    sendTestNotification();
    toast.success('Test notification sent!');
  };

  const handleBrowserNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Answer24 Test', {
          body: 'This is a test notification from Answer24!',
          icon: '/favicon.ico',
        });
        toast.success('Browser notification sent!');
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Answer24 Test', {
              body: 'This is a test notist;nTeicatioult Notifxport defa);
};

eCard>
   </
   rdContent>
      </Ca  </div>     d</p>
 ngs if needetion setcati notifir'sr browseck you• Che  <p>  
      ocally</p>ons work latificotirowser n <p>• B       /p>
  tion<ver integrarequire sers ion notificat<p>• Push          -y-1">
cegray-500 spaxs text-="text-meNaclassdiv    <          
v>
    </di>
       tton  </Bu        tion
ficaotiwser Nest Bro         T" />
   "w-4 h-4e=classNamBell   <  >
                  2"
p-center gaitems-lex ll fe="w-fu   classNam        
 ine"nt="outlria       vation}
     ficatiNoandleBrowseronClick={h           
    <Button        
       on>
   tt    </Bu    n
  icatioPush NotifTest             " />
"w-4 h-4assName= <Bell cl            >
   
      r gap-2"items-centel flex ame="w-fulssN        claion}
    NotificatTestdlehank={    onClic       Button 
    <       ">
e-y-2="spacsNamelasdiv c        <        
 </p>
       
tly.ecrrco working ything isre evernsustem to eon syatiificot  Test the n    ">
    ay-600-sm text-grsName="text     <p clas">
   y-4"space-assName=nt clte  <CardConr>
    ardHeade     </Ctle>
   </CardTi
       TestNotification       " />
   w-5 h-5="lassNameestTube c   <T>
       ter gap-2"cenems-x ite="fle classNam<CardTitler>
          <CardHeade">
    automax-w-md mx-ssName=" <Card claeturn (
   ;

  r}
  }s');
    onificatiort not not suppesrowser dohis b('Trror    toast.e   } else {
    }
   ngs.');
  r settiowsein your brthem enable lease . Pe blockedations artificror('No toast.er   e {
    ls      } e     });
   
        }enied');
   don permissiication('Notifst.error       toa
      { else        }sent!');
  ation ser notificowcess('Br   toast.suc   
              });    on.ico',
on: '/favic         ic!',
     wer24om Ansfication fr