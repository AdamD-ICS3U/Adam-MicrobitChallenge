/*
'A' inputs a dot (signified by short blink)
'B' inputs a dash (signified by long blink)
Shake erases the last input (signified by double blink) (X appears if nothing to clear)
A+B stores the letter (signified by down arrow)
A+B directly after storing a letter sends the stored letters (signified by up arrow)

Once the sender gets a message from the reciever that the message was received, 
a checkmark appears on the sender's microbit, and the storage is cleared
(This is beneficial because if there is no response, the word is not cleared,
so you can just send again)

Also, for some reason the first time you transmit, the second microbit appears, but does nothing, just send it again
*/


function decode (str : string) {  //this function check what letter the input is
    switch (str) {
        case '12':
            return('A');
            break;
        case '2111':
            return('B');
            break;
        case '2121':
            return('C');
            break;
        case '211':
            return('D');
            break;
        case '1':
            return('E');
            break;
        case '1121':
            return('F');
            break;
        case '221':
            return('G');
            break;
        case '1111':
            return('H');
            break;
        case '11':
            return('I');
            break;
        case '1222':
            return('J');
            break;
        case '212':
            return('K');
            break;
        case '1211':
            return('L');
            break;
        case '22':
            return('M');
            break;
        case '21':
            return('N');
            break;
        case '222':
            return('O');
            break;
        case '1221':
            return('P');
            break;
        case '2212':
            return('Q');
            break;
        case '121':
            return('R');
            break;
        case '111':
            return('S');
            break;
        case '2':
            return('T');
            break;
        case '112':
            return('U');
            break;
        case '1112':
            return('V');
            break;
        case '122':
            return('W');
            break;
        case '2112':
            return('X');
            break;
        case '2122':
            return('Y');
            break;
        case '2211':
            return('Z');
            break;
        case '12222':
            return('1');
            break;
        case '11222':
            return('2');
            break;
        case '11122':
            return('3');
            break;
        case '11112':
            return('4');
            break;
        case '11111':
            return('5');
            break;
        case '21111':
            return('6');
            break;
        case '22111':
            return('7');
            break;
        case '22211':
            return('8');
            break;
        case '22221':
            return('9');
            break;
        case '22222':
            return('0');
            break;
        default:
            return('/');
    }

}

function ledsOff() {  //turns all the leds off
    basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    `, 0)
}

function ledsOn() {  //turns all the leds on
    basic.showLeds(`
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        # # # # #
        `, 0)
}

let letterBuffer: Array<number> = [];//This array will keep track of the dots and dashes
                                     //A 1 is a dot, a 2 is a dash 
                                     //(I didn't use 0 and 1 because a number starting with a 0 is interpreted as octal)
let wordBuffer = '';  //This is the string that letters will be put into
function sender() {
      
    


    input.onButtonPressed(Button.A, function () {  //add a 1 to letter buffer and show a short blink
        letterBuffer.push(1); 

        ledsOn();
        basic.pause(100);
        ledsOff();
    })

    input.onButtonPressed(Button.B, function () {  //add a 2 to letter buffer and show a long blink
        letterBuffer.push(2);
        ledsOn();
        basic.pause(300);
        ledsOff();
    })

    input.onGesture(Gesture.Shake, function () { 
        if (letterBuffer.length >= 1) {  //if there are inputs waiting to be stored, shaking erases the last one
            letterBuffer.pop();
            ledsOn();
            basic.pause(100);
            ledsOff();
            basic.pause(100);
            ledsOn();
            basic.pause(100);
            ledsOff();
        } else {  //show an X, meaning there is nothing to erase
            basic.showIcon(IconNames.No, 0);
            basic.pause(100);
            ledsOff();
            basic.pause(100);
            basic.showIcon(IconNames.No, 0);
            basic.pause(100);
            ledsOff();
        }
    })

    input.onButtonPressed(Button.AB, function () {  //On A+B:
        if (letterBuffer.join('') == '') {  //if you try to store nothing, send what is stored
            radio.sendString(wordBuffer);
            basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `, 500)
            ledsOff();
        } else if (decode(letterBuffer.join('')) != '/') {  //if what you input is actually a letter/num, store it
            wordBuffer += decode(letterBuffer.join(''));
            letterBuffer = [];
            basic.showLeds(`
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
            `, 500)
            ledsOff();
        } else {  //show error (this is only called if the input is not a letter or number)
            basic.showIcon(IconNames.No, 0);
            basic.pause(100);
            ledsOff();
            basic.pause(100);
            basic.showIcon(IconNames.No, 0);
            basic.pause(100);
            ledsOff();

            letterBuffer = [];
        }
    })



}

sender();


radio.onReceivedString(function (receivedString: string) {
    receiver(receivedString);  //call reciever when you recieve a string
})

function receiver(str: string) {
    if (str == 'Got It') {  //if you receive 'Got It', then clear the buffers and show a check
        wordBuffer = '';
        letterBuffer = [];
        basic.showIcon(IconNames.Yes, 500);              
        basic.pause(1000);
        ledsOff();
    } else {  //show the string and send back 'Got It'
        radio.sendString('Got It')
        basic.showString(str);  
    }
}