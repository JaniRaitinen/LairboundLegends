import time

stillimage = \
    {"lk1":
         '''                               
                                            __----~~~~~~~~~~~------___
                                  .  .   ~~//====......          __--~ ~~
                  -.            \_|//     |||\ \  ~~~~~~::::... /~
               ___-==_       _-~o~  \/    |||  \ \            _/~~-
       __---~~~.==~||\=_    -_--~/_-~|-   |\ \   \ \        _/~
   _-~~     .=~    |  \ \-_    '-~7  /-   /  ||    \      /
 .~       .~       |   \ \ -_    /  /-   /   ||      \   /
/  ____  /         |     \ \ ~-_/  /|- _/   .||       \ /
|~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        . .
         '         ~-|      /|    |-~\~~       __--~~
                     |-~~-_/ |    |   ~\_   _-~            /
                          /  \     \__   \/~                \__
                      _--~ _/ | .-~~____--~-/                  ~~==.
                     ((->/~   '.|||' -_|    ~~-/ ,              . _||
                                -_     ~\      ~~---l__i__i__i--~~_/
                                _-~-__   ~)  \--______________--~~
                              //.-~~~-~_--~- |-------~~~~~~~~
                                     //.-~~~--''',
      "gamestartscroll1":
      '''
   ______________________________
 / \                             \.
|   |     How to Raise your      |.
 \_ |         Dragon?            |.
    |                            |.
    |  Your Dragon Desires A     |.
    |    Specific Weather        |.
    |                            |.
    | If You Guess the Weather   |.
    | Correctly, You will Gain   |.
    | The Same Amount Of Stamina |.
    | As The Journey You Flew.   |.
    | Likewise, A Wrong Guess    |.
    | Will Deplete the Dragons   |.
    | Stamina                    |.
    |                            |. 
    |   Should Stamina Go Below  |.
    |            ZERO            |.
    |   Your Dragon Will Meet    |.
    |   Their Untimely Demise.   |.
    |                            |.
    |   _________________________|___
    |  /    Safe Travels...         /.
    \_/dc__________________________/.
      ''',
     "linna1": '''
     
                                                |>>>
                                                |
                                            _  _|_  _
                                           |;|_|;|_|;|
                                           \;.    .  /
                                            \;:  .  /
                                             ||:   |
                                             ||:.  |
                                             ||:  .|
                                             ||:   |       \,/
                                             ||: , |            
                                             ||:   |
                                             ||: . |
              __                            _||_   |
     ____--`~    '--~~__            __ ----~    ~`---,              ___
-~--~                   ~---__ ,--~'                  ~~----_____-~'   `~----~~
     ''',
     "titlescreen": '''
 █████╗ ██╗██████╗ ██████╗  ██████╗ ██████╗ ████████╗███████╗     █████╗ ███╗   ██╗██████╗     ██████╗ ██████╗  █████╗  ██████╗  ██████╗ ███╗   ██╗███████╗
██╔══██╗██║██╔══██╗██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝    ██╔══██╗████╗  ██║██╔══██╗    ██╔══██╗██╔══██╗██╔══██╗██╔════╝ ██╔═══██╗████╗  ██║██╔════╝
███████║██║██████╔╝██████╔╝██║   ██║██████╔╝   ██║   ███████╗    ███████║██╔██╗ ██║██║  ██║    ██║  ██║██████╔╝███████║██║  ███╗██║   ██║██╔██╗ ██║███████╗
██╔══██║██║██╔══██╗██╔═══╝ ██║   ██║██╔══██╗   ██║   ╚════██║    ██╔══██║██║╚██╗██║██║  ██║    ██║  ██║██╔══██╗██╔══██║██║   ██║██║   ██║██║╚██╗██║╚════██║
██║  ██║██║██║  ██║██║     ╚██████╔╝██║  ██║   ██║   ███████║    ██║  ██║██║ ╚████║██████╔╝    ██████╔╝██║  ██║██║  ██║╚██████╔╝╚██████╔╝██║ ╚████║███████║
╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝
     ''',
     "alttitlescreen": '''
▄█          ▄████████  ▄█     ▄████████ ▀█████████▄   ▄██████▄  ███     █▄  ███▄▄▄▄   ████████▄       ▄█          ▄████████    ▄██████▄     ▄████████  ███▄▄▄▄   ████████▄    ▄████████ 
███         ███    ███ ███    ███    ███   ███    ███ ███    ███ ███    ███ ███▀▀▀██▄ ███   ▀███      ███         ███    ███   ███    ███   ███    ███ ███▀▀▀██▄ ███   ▀███   ███    ███ 
███         ███    ███ ███▌   ███    ███   ███    ███ ███    ███ ███    ███ ███   ███ ███    ███      ███         ███    █▀    ███    █▀    ███    █▀  ███   ███ ███    ███   ███    █▀  
███         ███    ███ ███▌  ▄███▄▄▄▄██▀  ▄███▄▄▄██▀  ███    ███ ███    ███ ███   ███ ███    ███      ███        ▄███▄▄▄      ▄███         ▄███▄▄▄     ███   ███ ███    ███   ███        
███       ▀███████████ ███▌ ▀▀███▀▀▀▀▀   ▀▀███▀▀▀██▄  ███    ███ ███    ███ ███   ███ ███    ███      ███       ▀▀███▀▀▀     ▀▀███ ████▄  ▀▀███▀▀▀     ███   ███ ███    ███ ▀███████████ 
███         ███    ███ ███  ▀███████████   ███    ██▄ ███    ███ ███    ███ ███   ███ ███    ███      ███         ███    █▄    ███    ███   ███    █▄  ███   ███ ███    ███          ███ 
███▌    ▄   ███    ███ ███    ███    ███   ███    ███ ███    ███ ███    ███ ███   ███ ███   ▄███      ███▌    ▄   ███    ███   ███    ███   ███    ███ ███   ███ ███   ▄███    ▄█    ███ 
█████▄▄██   ███    █▀  █▀     ███    ███ ▄█████████▀   ▀██████▀  ████████▀   ▀█   █▀  ████████▀       █████▄▄██   ██████████   ████████▀    ██████████  ▀█   █▀  ████████▀   ▄████████▀  
▀                             ███    ███                                                              ▀                                                                                  
'''}


def showimage(_imageid):
    tulos = stillimage[_imageid]
    return tulos


def letterbyletter(_string, print_speed=0.02):
    for c in _string:
        print(c, end="")
        # Odota hetki jos kirjain on lauseen loppukirjain
        if c == ",":
            time.sleep(print_speed * 25)
        elif c == "." or c == "?" or c == "!":
            time.sleep(print_speed * 50)
        else:
            time.sleep(print_speed)
    return


def printriviriviltään(_string, pause_duration=1):
    lines = _string.split('\n')
    for line in lines:
        print(line)
        time.sleep(pause_duration)
    return