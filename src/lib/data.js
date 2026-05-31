// Source of truth for odyc-avatars: the color palette and the 131 8x8 sprite
// templates. Edit here — consumed by avatar.js (web) and cli.mjs (Node CLI).
//
// Template role chars: '.' transparent · B body · A accent · E eye (dark)
//                      W white/highlight · M mouth/detail (dark)
export const PALETTE = [
  {
    "value": ".",
    "name": "transparent",
    "rgb": null
  },
  {
    "value": 0,
    "name": "dark",
    "rgb": "rgb(33, 37, 41)",
    "hex": "#212529"
  },
  {
    "value": 1,
    "name": "light",
    "rgb": "rgb(248, 249, 250)",
    "hex": "#f8f9fa"
  },
  {
    "value": 2,
    "name": "gray",
    "rgb": "rgb(206, 212, 218)",
    "hex": "#ced4da"
  },
  {
    "value": 3,
    "name": "blue",
    "rgb": "rgb(34, 139, 230)",
    "hex": "#228be6"
  },
  {
    "value": 4,
    "name": "red",
    "rgb": "rgb(250, 82, 82)",
    "hex": "#fa5252"
  },
  {
    "value": 5,
    "name": "yellow",
    "rgb": "rgb(252, 196, 25)",
    "hex": "#fcc419"
  },
  {
    "value": 6,
    "name": "orange",
    "rgb": "rgb(255, 146, 43)",
    "hex": "#ff922b"
  },
  {
    "value": 7,
    "name": "green",
    "rgb": "rgb(64, 192, 87)",
    "hex": "#40c057"
  },
  {
    "value": 8,
    "name": "pink",
    "rgb": "rgb(240, 101, 149)",
    "hex": "#f06595"
  },
  {
    "value": 9,
    "name": "brown",
    "rgb": "rgb(165, 47, 1)",
    "hex": "#a52f01"
  }
];

export const TEMPLATES = {"cat":["B......B","BB....BB","BBBBBBBB","BEBBBBEB","BBBBBBBB","BBMBBMBB",".BBBBBB.","..BBBB.."],"dog":["B......B","BBB..BBB","BBBBBBBB","BEBBBBEB","BBBBBBBB","BBBMMBBB",".BBBBBB.","..B..B.."],"fox":["B......B","BB....BB","BBBBBBBB","BEBBBBEB",".BBBBBB.",".BBWWBB.","..BMMB..","...BB..."],"bear":["BB....BB","BBB..BBB",".BBBBBB.",".BEBBEB.",".BBBBBB.",".BBWWBB.",".BBMMBB.","..BBBB.."],"panda":["AA....AA","ABBBBBBA","BBBBBBBB","BAEBBEAB","BBBBBBBB","BBBMMBBB",".BBBBBB.","..BBBB.."],"rabbit":[".B....B.",".BB..BB.",".BBBBBB.","BEBBBBEB","BBBBBBBB","BBBMMBBB",".BBBBBB.","..BBBB.."],"mouse":["AA....AA","AABBBBAA",".BBBBBB.","BEBBBBEB","BBBBBBBB","BBBMMBBB",".BBBBBB.","..BBBBAA"],"pig":[".B....B.","BBBBBBBB","BEBBBBEB","BBBBBBBB","BBBAABBB","BBBAABBB",".BBBBBB.","..B..B.."],"cow":["A......A","AABBBBAA",".BBBBBB.",".BEBBEB.",".BBBBBB.",".BBAABB.",".BBBBBB.","..A..A.."],"sheep":[".WWWWWW.","WWWWWWWW","WWBBBBWW","WBEBBEBW","WBBBBBBW","WWBBBBWW","WWWWWWWW",".B....B."],"monkey":["A......A","ABBBBBBA",".BEBBEB.",".BBBBBB.",".BAAAAB.",".BAMMAB.",".BBBBBB.","..B..B.."],"lion":[".AAAAAA.","AABBBBAA","ABEBBEBA","ABBBBBBA","AABMMBAA",".ABBBBA.",".AAAAAA.","..A..A.."],"tiger":[".B....B.","BBBBBBBB","BAEAAEAB","BBBBBBBB","BABBBBAB","BBMMMMBB",".BBBBBB.","..B..B.."],"elephant":["AA....AA","AAAAAAAA","AAEAAEAA","AAAAAAAA","AAABBAAA",".AABBAA.",".AABBAA.",".A.BB.A."],"koala":["A......A","AABBBBAA",".BBBBBB.",".BEBBEB.",".BBAABB.",".BBBBBB.",".BBBBBB.","..B..B.."],"hedgehog":["A.A.A.A.","AAAAAAAA",".ABBBBBB","..BEBBBA",".ABBBBBB","AAAAAAAA","..B..B..","........"],"bat":["B......B","BB.BB.BB","BBBBBBBB","BEBBBBEB","BBBBBBBB",".BMBBMB.",".B....B.","........"],"frog":["WE....EW",".BBBBBB.","BBBBBBBB","BBBBBBBB","BMMMMMMB","BBBBBBBB",".BBBBBB.",".B....B."],"blob":[".BBBBBB.","BBBBBBBB","BEBBBBEB","BBBBBBBB","BBBMMBBB","BBBBBBBB",".BBBBBB.","..BBBB.."],"alien":["B..BB..B",".B.BB.B.",".BBBBBB.",".BWBBWB.",".BBBBBB.",".B.BB.B.","B.B..B.B",".B....B."],"robot":["...AA...",".A.BB.A.",".BBBBBB.",".BWBBWB.",".BBBBBB.",".BMMMMB.",".BBBBBB.","..B..B.."],"ghost":["..BBBB..",".BBBBBB.","BBBBBBBB","BWEBBWEB","BBBBBBBB","BBBBBBBB","BBBBBBBB","B.BB.BB."],"smiley":[".BBBBBB.","BBBBBBBB","BEBBBBEB","BBBBBBBB","BMBBBBMB","BBMMMMBB",".BBBBBB.","..BBBB.."],"skull":[".BBBBBB.","BBBBBBBB","BEEBBEEB","BBBBBBBB","BBBMMBBB","BBBBBBBB","B.B.B.B.",".B.B.B.."],"eye":["........",".BBBBBB.","BWWWWWWB","BWWEEWWB","BWWEEWWB","BWWWWWWB",".BBBBBB.","........"],"dinosaur":[".....BBB","....BBBB","....BEBB","BBB.BBB.",".BBBBBB.",".BBBBBB.",".BB.BB..",".B...B.."],"bird":["...BB...","..BBBB..",".BEBBB..",".BBBBBA.","BBBBBB..",".BBBBB..","..B.B...","........"],"owl":[".B....B.",".BBBBBB.","BWEWWEWB","BWWWWWWB","BBBABBBB","BBBBBBBB",".BBBBBB.",".B....B."],"penguin":["..BBBB..",".BBBBBB.",".BWEEWB.",".BWWWWB.","BBWWWWBB","BBWWWWBB",".BBAABB.",".A....A."],"duck":["........","...BBB..","..BBBBB.","..BEBBAA","..BBBBB.","..BBBBB.","...BBB..","...AA..."],"chick":["........","..BBBB..",".BBBBBB.",".BEBBEB.",".BBAABB.",".BBBBBB.","..BBBB..","...AA..."],"fish":["........",".BBBB..A","BBBBBBAA","BEBBBBAA","BBBBBBAA",".BBBB..A","........","........"],"whale":["..A.....","..AA..AA",".BBBBBBA","BBBBBBBB","BEBBBBBB",".BBBBBB.","........","........"],"shark":["...B....","..BBB...",".BBBBBBA","BBBBBBBB","BEBBBBBB","BWWWWWBB",".BBBBBB.","........"],"octopus":[".BBBBBB.","BBBBBBBB","BEBBBBEB","BBBBBBBB","BBBBBBBB",".BBBBBB.","B.BB.BB.",".B.BB.B."],"crab":["B......B","BB....BB",".BBBBBB.","BEBBBBEB","BBBBBBBB",".BBBBBB.","B.B..B.B","........"],"jellyfish":[".BBBBBB.","BBBBBBBB","BBBBBBBB","BBEBBEBB",".BBBBBB.",".A.A.A.A","A.A.A.A.",".A.A.A.."],"seahorse":["..AAA...",".AEAAA..","..AAA...","...AAA..","..AAA...",".AAA....","..AAA...","...AA..."],"turtle":["........","..AAAA..",".AABBAA.","EABBBBA.",".ABBBBA.","..AAAA..",".B....B.","........"],"snail":["........",".AAA....","AABAA..B","ABBBA.BB","ABBBA.EB","AABAABBB",".AAABBBB","BBBBBBBB"],"snake":[".BBBBB..",".B...B..",".B.B.B..",".B.B.B..",".B.BBB..",".B......",".BB.EE..","...BBB.."],"bee":[".W....W.",".WBBBBW.",".BABABA.",".BABABA.",".BABABA.","..BBBB..","...AA...","........"],"butterfly":["B.B..B.B","BBBWWBBB","BBBWWBBB",".BBWWBB.",".BBWWBB.","BBBWWBBB","B.B..B.B","....A..."],"ladybug":["...EE...","..BBBB..",".BEBBEB.","BBBBBBBB","BBEBBEBB","BBBBBBBB",".BEBBEB.","..BBBB.."],"apple":["...BA...","...B....",".BBBBBB.","BBBBBBBB","BBBBBBBB","BBBBBBBB",".BBBBBB.","..BBBB.."],"orange":["...A....","..BBBB..",".BBBBBB.","BBBBBBBB","BBBBBBBB","BBBBBBBB",".BBBBBB.","..BBBB.."],"pear":["...B....","..BBB...","..BBB...",".BBBBB..",".BBBBBB.","BBBBBBBB","BBBBBBBB",".BBBBBB."],"banana":["......BB",".....BB.","....BB..","...BB...","A..BB...","AABB....",".BBB....",".AA....."],"cherry":[".....A..","....AA..","...A.A..","..A...A.",".BB..BB.","BBBBBBBB","BBB..BBB",".BB..BB."],"grapes":["...AA...","..BBBB..",".BBBBBB.","BBBBBBBB",".BBBBBB.","..BBBB..","...BB...","........"],"strawberry":[".A.AA.A.","..AAAA..",".BBBBBB.","BBWBBWBB","BBBWBBBB",".BWBBWB.","..BBBB..","...BB..."],"watermelon":[".BBBBBB.","BAAAAAAB","AAEAAEAA","AAAAAAAA","AEAAAEAA",".AAAAAA.","..AAAA..","...AA..."],"pineapple":["..A.A...",".AAAAA..","..AAA...",".BWBWBB.","BWBWBWBB",".BWBWBB.",".BWBWBB.","..BBBB.."],"carrot":[".A.A.A..","..AAA...","..BBB...","..BBB...","..BBB...","...BB...","...BB...","....B..."],"broccoli":["..AAAA..",".AAAAAA.","AAAAAAAA",".AAAAAA.","...BB...","...BB...","..BBBB..","..BBBB.."],"pepper":["....AA..","...BB...","..BBB...","..BBB...",".BBB....",".BBB....",".BB.....",".B......"],"tomato":["..A.A...",".AABAA..",".BBBBBB.","BBBBBBBB","BBBBBBBB","BBBBBBBB",".BBBBBB.","..BBBB.."],"eggplant":["...AA...","..AB....","..BBBB..",".BBBBBB.",".BBBBBB.",".BBBBBB.",".BBBBB..","..BBB..."],"corn":["..AAAA..",".ABBBBA.",".BWBWBB.",".BBWBWB.",".BWBWBB.",".BBWBWB.",".ABBBBA.","...AA..."],"mushroom":["..AAAA..",".AWAAWA.","AAAAAAAA",".AAAAAA.","...BB...","..WBBW..","..BBBB..","..BBBB.."],"icecream":["..BBBB..",".BBBBBB.",".BBBBBB.","..AAAA..","..AAAA..","...AA...","...AA...","....A..."],"cake":["....A...","...WMW..",".BBBBBB.",".BAAAAB.",".BBBBBB.",".BAAAAB.",".BBBBBB.","........"],"cupcake":["..AAAA..",".AAAAAA.","AAAAAAAA",".BWBWBB.",".BWBWBB.",".BBWBWB.","..BBBB..","........"],"cookie":["..BBBB..",".BBMBBB.","BBBBBMBB","BMBBBBBB","BBBBMBBB","BBMBBBBB",".BBBBMB.","..BBBB.."],"donut":["..BBBB..",".BABBAB.","BB....BB","BB....BB",".BBABBA.","..BBBB..","........","........"],"candy":["A......A","AA.BB.AA",".ABBBBA.",".ABBBBA.",".ABBBBA.",".ABBBBA.","AA.BB.AA","A......A"],"lollipop":[".BBBB...","BBABBB..","BABABB..","BBABAB..",".BBBB...","...B....","...B....","...B...."],"pizza":["....B...","...BBB..","..BABAB.","..BAAAB.",".BAEABAB",".BAAAEAB","BBBBBBBB","........"],"burger":[".BBBBBB.","BWBWBWBB",".MMMMMM.",".AAAAAA.",".MMMMMM.",".BBBBBB.","........","........"],"hotdog":["........",".BBBBBB.","BWWWWWWB","BAAAAAAB","BWWWWWWB",".BBBBBB.","........","........"],"fries":[".A.A.A..",".AAAAA..","AAAAAAA.",".BBBBBB.",".BBBBBB.",".BWBWBB.",".BBBBBB.","........"],"egg":["........","..WWWW..",".WWWWWW.",".WWAAWW.",".WWAAWW.",".WWWWWW.","..WWWW..","........"],"bread":[".BBBBBB.","BBBBBBBB","BAAAAAAB","BAAAAAAB","BAAAAAAB","BBBBBBBB","........","........"],"cheese":["BBBBBBBB","BB.BBBBB","BBBBB.BB","B.BBBBBB","BBBB.BBB",".BBBBBBB","..BBBBB.","...BBB.."],"coffee":["........",".BBBBBB.",".BAAAAB.",".BAAAABA",".BAAAABA",".BAAAAB.",".BBBBBB.","..BBBB.."],"tree":["..AAAA..",".AAAAAA.","AAAAAAAA",".AAAAAA.","..AAAA..","...BB...","...BB...","..BBBB.."],"flower":["..AA.A..",".AAAAAA.","AAAWAAAA",".AAAAAA.","...BB...","..BBBB..","...BB...","...BB..."],"rose":["..AAAA..",".AABBAA.",".ABBBBA.",".AABBAA.","..AAAA..","...B....","..BAB...","...B...."],"tulip":[".A.A.A..",".AAAAA..",".AAAAA..","..AAA...","...B....","...B....",".BBABB..","...B...."],"sunflower":[".A.AA.A.",".ABBBBA.","AABEEBAA","AABEEBAA",".ABBBBA.",".A.AA.A.","...MM...","..M..M.."],"cactus":["...B....",".B.B....",".B.BB...",".BBB.B..","...B.B..","...BBB..","..AAAA..","..AAAA.."],"palm":[".A.AAA..","AAA.A.A.","..AAA...","...B....","...B....","...B....","..ABA...",".AABAA.."],"leaf":[".......B",".....BBB","...BBBBB","..BBMBB.",".BBMBB..",".BMBB...","BMB.....","M......."],"clover":[".BB..BB.","BBBBBBBB","BBBBBBBB",".BBBBBB.","..BBBB..","...AA...","...AA...","...AA..."],"sun":["A..A..A.",".BBBBBB.","ABBBBBBA",".BBBBBB.",".BBBBBB.","ABBBBBBA",".BBBBBB.","A..A..A."],"moon":["..BBB...",".BB.....","BB......","BB......","BB......",".BB.....","..BBB...","........"],"cloud":["........","...BB...","..BBBB..",".BBBBBBB","BBBBBBBB","BBBBBBBB",".BBBBBB.","........"],"rainbow":[".BBBBBB.","BAAAAAAB","AB....BA","B......B","........","........","........","........"],"raindrop":["...BB...","...BB...","..BBBB..",".BBBBBB.",".BBBBBB.",".BBBBBB.","..BBBB..","........"],"snowflake":["...B....","B..B..B.",".B.B.B..","..BBB...","BBBBBBBB","..BBB...",".B.B.B..","B..B..B."],"fire":["...A....","..AA....","..AAB...",".AABB...",".ABBB...","AABBBB..","AABBBB..",".AAAA..."],"lightning":["...AA...","..AA....",".AA.....","AAAAA...","...AA...","..AA....",".AA.....",".A......"],"mountain":["........","...W....","..WAW...","..AAA...",".AAAAA..",".AAAAAA.","AAAAAAAA","........"],"planet":["..BBBB..",".BBBBBB.","ABBBBBBA","AABBBBAA",".BBBBBB.","..BBBB..","........","........"],"star":["...BB...","...BB...","BBBBBBBB",".BBBBBB.","..BBBB..",".BB..BB.",".B....B.","........"],"house":["...AA...","..AAAA..",".AAAAAA.","AAAAAAAA",".BWBBWB.",".BBMBBB.",".BBMBBB.","........"],"rocket":["...B....","..BBB...","..BWB...","..BBB...","..BBB...",".ABBBA..","A.BBB.A.","..A.A..."],"car":["........","..BBBB..",".BWBBWB.","BBBBBBBB","BBBBBBBB","EBBBBBBE",".E....E.","........"],"boat":["...A....","...AA...","...AAA..","...AAAA.","...B....","BBBBBBBB",".BBBBBB.","..BBBB.."],"airplane":["....B...","....BB..","BBBBBBB.",".BBBBBBB","....BB..","....B...","........","........"],"tv":["...A.A..",".BBBBBB.",".BWWWWB.",".BWWWWB.",".BWWWWB.",".BBBBBB.",".B....B.","........"],"camera":["........","..AA....",".BBBBBBB",".BWWWWBB",".BWAAWBB",".BWWWWBB",".BBBBBBB","........"],"phone":[".BBBBBB.",".BBBBBB.",".BWWWWB.",".BWWWWB.",".BWWWWB.",".BWWWWB.",".BBAABB.",".BBBBBB."],"lightbulb":["..BBBB..",".BBBBBB.",".BBBBBB.",".BBBBBB.","..BBBB..","..AAAA..","..AAAA..","...AA..."],"key":[".BBB....","B...B...","B.B.B...","B...B...",".BBB....","..B.....","..BBB...","..B.B..."],"lock":["..BBBB..",".B....B.",".B....B.","AAAAAAAA","AAAMAAAA","AAAMAAAA","AAAAAAAA","........"],"gift":["...AA...","..AAAA..","BBBABBBB","BBBABBBB","BBBABBBB","BBBABBBB","BBBABBBB","........"],"balloon":["..BBBB..",".BBBBBB.",".BBBBBB.",".BBBBBB.","..BBBB..","...BB...","...A....","..A....."],"umbrella":["...AA...","..AAAA..",".AAAAAA.","AAAAAAAA","....B...","....B...","....B...","...BA..."],"crown":["A.A.A.A.","AAAAAAAA","AWAWAWAA","AAAAAAAA","........","........","........","........"],"gem":[".BBBBBB.","BWBBBBWB","BBBBBBBB",".BBBBBB.","..BBBB..","...BB...","........","........"],"ring":["...W....","..AWA...","...A....",".BB.BB..","B.....B.","B.....B.",".B...B..","..BBB..."],"sword":["...B....","...B....","...B....","...B....","...B....",".AAAAA..","...A....","...A...."],"shield":[".BBBBBB.","BBBBBBBB","BBAAAABB","BBAAAABB","BBBBBBBB",".BBBBBB.","..BBBB..","...BB..."],"anchor":["...B....","..BBB...","...B....",".BBBBB..","...B....","B..B..B.","BB.B.BB.",".BBBBBB."],"bomb":[".....A..","......A.","..BBB...",".BBBBB..",".BWBBB..",".BBBBB..",".BBBBB..","..BBB..."],"bell":["...A....","..BBB...",".BBBBB..",".BBBBB..","BBBBBBB.","BBBBBBB.",".AAAAA..","...A...."],"clock":[".BBBBBB.","BWWWWWWB","BWWMWWWB","BWWMMWWB","BWWWWWWB",".BBBBBB.","........","........"],"book":["BBBBBBB.","BWWWWWBB","BWWWWWBB","BWWWWWBB","BWWWWWBB","BBBBBBB.","........","........"],"pencil":[".......A","......BB",".....BB.","....BB..","...BB...","..BB....",".MB.....","M......."],"paintbrush":[".......A","......AB",".....BB.","....BB..","...BB...","..WW....",".WWW....","WWW....."],"scissors":["B.....B.",".B...B..","..B.B...","...A....","..A.A...",".A...A..","A.....A.","........"],"hammer":[".AAAA...",".AAAAA..",".AAAA...","...B....","...B....","...B....","...B....","...B...."],"flag":["B.......","BAAAAA..","BAAAAA..","BAAAAA..","B.......","B.......","B.......","B......."],"hat":["..BBBB..","..BBBB..","..BBBB..","..AAAA..","BBBBBBBB","........","........","........"],"glasses":["........",".BB..BB.","B..BB..B","B..BB..B",".BB..BB.","........","........","........"],"boot":[".BB.....",".BB.....",".BB.....",".BB.....",".BBBBB..",".BBBBBB.",".BBBBBB.","........"],"shirt":["BB....BB","BBBBBBBB",".BBBBBB.",".BBBBBB.",".BBBBBB.",".BBBBBB.",".BBBBBB.","........"],"heart":[".BB..BB.","BBBBBBBB","BBBBBBBB","BBBBBBBB",".BBBBBB.","..BBBB..","...BB...","........"],"music":["......BB",".....BBB",".....B..",".....B..",".BBBBB..","BBB.B...","BBB.....",".B......"],"arrow":["...B....","..BB....",".BBBBBBB","BBBBBBBB",".BBBBBBB","..BB....","...B....","........"]};
