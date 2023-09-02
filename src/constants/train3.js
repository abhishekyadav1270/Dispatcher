const UP = "up";
const DN = "down";

const stations = [
    /////////////////////////// Line7//////////////////////////
    {
        name: 'Gundavli',
        abbr: 'GUN',
        upLTE: 'B7',
        downLTE: 'B56',
        SDDdn: "7",
        SDDup: '8',
        nextVTE: '9'
    },
    {
        name: 'Mogra',
        abbr: 'MOG',
        upLTE: 'B13',
        downLTE: 'B61',
        SDDdn: "16",
        SDDup: '17'
    }, {
        name: 'Jogeshwari(East)',
        abbr: 'JOE',
        upLTE: 'B15',
        downLTE: 'B63',
        SDDdn: "20",
        SDDup: '21'
    }, {
        name: 'Goregaon',
        abbr: 'GOE',
        upLTE: 'B17',
        downLTE: 'B65',
        SDDdn: "24",
        SDDup: '25'
    }, {
        name: 'Aarey',
        abbr: 'AAR',
        upLTE: 'B22',
        downLTE: 'B70',
        SDDdn: "32",
        SDDup: '33'
    }, {
        name: 'Dindoshi',
        abbr: 'DIN',
        upLTE: 'B27',
        downLTE: 'B75',
        SDDdn: "40",
        SDDup: '41'
    }, {
        name: 'Kurar',
        abbr: 'KUR',
        upLTE: 'B29',
        downLTE: 'B77',
        SDDdn: "44",
        SDDup: '45'
    }, {
        name: 'Akurli',
        abbr: 'AKU',
        upLTE: 'B31',
        downLTE: 'B17',
        SDDdn: "48",
        SDDup: '49'
    }, {
        name: 'Poisar',
        abbr: 'POI',
        upLTE: 'B33',
        downLTE: 'B81',
        SDDdn: "52",
        SDDup: '53'
    }, {
        name: 'Magathane',
        abbr: 'MAG',
        upLTE: 'B35',
        downLTE: 'B83',
        SDDdn: "56",
        SDDup: '57'
    }, {
        name: 'Devipada',
        abbr: 'DEV',
        upLTE: 'B37',
        downLTE: 'B85',
        SDDdn: "60",
        SDDup: '61'
    }, {
        name: 'Rashtriya udyam',
        abbr: 'RAU',
        upLTE: 'B39',
        downLTE: 'B87',
        SDDdn: "64",
        SDDup: '65'
    }, {
        name: 'Ovaripada',
        abbr: 'OVA',
        upLTE: 'B41',
        downLTE: 'B89',
        SDDdn: "68",
        SDDup: '69'
    },
    /////////////////line 2A//////////////////////////////
    {
        name: 'Dahisar',
        abbr: 'DAE',
        upLTE: 'B104',
        downLTE: 'B164',
        SDDdn: "2AT4405",
        SDDup: '2AT4406',
        //nextVTE:'9'
    },
    {
        name: 'Upper Dahisar',
        abbr: 'UPD',
        upLTE: 'B109',
        downLTE: 'B169',
        SDDdn: "2AT4501",
        SDDup: '2AT4502'
    }, {
        name: 'Kandarpada',
        abbr: 'KAN',
        upLTE: 'B111',
        downLTE: 'B171',
        SDDdn: "2AT4601",
        SDDup: '2AT4602'
    }, {
        name: 'Mandepeshwar',
        abbr: 'MAN',
        upLTE: 'B113',
        downLTE: 'B173',
        SDDdn: "2AT4701",
        SDDup: '2AT4702'
    }, {
        name: 'Eksar',
        abbr: 'EKS',
        upLTE: 'B115',
        downLTE: 'B175',
        SDDdn: "2AT4801",
        SDDup: '2AT4802'
    }, {
        name: 'Borivali west',
        abbr: 'BOW',
        upLTE: 'B117',
        downLTE: 'B177',
        SDDdn: "2AT4901",
        SDDup: '2AT4902'
    }, {
        name: 'Pahadi Eksar',
        abbr: 'PAE',
        upLTE: 'B119',
        downLTE: 'B179',
        SDDdn: "2AT5001",
        SDDup: '2AT5002'
    }, {
        name: 'Kandivali West',
        abbr: 'KAW',
        upLTE: 'B121',
        downLTE: 'B181',
        SDDdn: "2AT5101",
        SDDup: '2AT5102',
        nextVTE: '2AT5103'
    }, {
        name: 'Dahanukarwadi',
        abbr: 'DAH',
        upLTE: 'B128',
        downLTE: 'B187',
        SDDdn: "2AT5207",
        SDDup: '2AT5206',
        nextVTE: '2AT5209'

    }, {
        name: 'Valnai',
        abbr: 'VAL',
        upLTE: 'B138',
        downLTE: 'B192',
        SDDdn: "2AT5301",
        SDDup: '2AT5302'
    }, {
        name: 'Malad West',
        abbr: 'MAW',
        upLTE: 'B140',
        downLTE: 'B194',
        SDDdn: "2AT5401",
        SDDup: '2AT5402'
    }, {
        name: 'Lower Malad',
        abbr: 'LOM',
        upLTE: 'B142',
        downLTE: 'B196',
        SDDdn: "2AT5501",
        SDDup: '2AT5502'
    }, {
        name: 'Pahadi Goregaon',
        abbr: 'PAG',
        upLTE: 'B144',
        downLTE: 'B198',
        SDDdn: "2AT5601",
        SDDup: '2AT5602'
    }, {
        name: 'Goreagin West',
        abbr: 'GOW',
        upLTE: 'B146',
        downLTE: 'B200',
        SDDdn: "2AT5701",
        SDDup: '2AT5702'
    }, {
        name: 'Oshiwara',
        abbr: 'OSH',
        upLTE: 'B148',
        downLTE: 'B202',
        SDDdn: "2AT5801",
        SDDup: '2AT5802'
    }, {
        name: 'Lower Oshiwara',
        abbr: 'LOO',
        upLTE: 'B150',
        downLTE: 'B204',
        SDDdn: "2AT5901",
        SDDup: '2AT5902'
    }, {
        name: 'Andher West',
        abbr: 'ANW',
        upLTE: 'B156',
        downLTE: 'B210',
        SDDdn: "2AT6007",
        SDDup: '2AT6008'
    }

];


const orangeDepotLTE = [
    { name: 'B336', locid: "23", lineState: 'DEPOT' },
    { name: 'B337', locid: "23", lineState: 'DEPOT' },
    { name: 'B338', locid: "23", lineState: 'DEPOT' },
    { name: 'B339', locid: "23", lineState: 'DEPOT' },
    { name: 'B340', locid: "23", lineState: 'DEPOT' },
    { name: 'B321', locid: "23", lineState: 'DEPOT' },
    { name: 'B322', locid: "23", lineState: 'DEPOT' },
    { name: 'B323', locid: "23", lineState: 'DEPOT' },
    { name: 'B324', locid: "23", lineState: 'DEPOT' },
    { name: 'B325', locid: "23", lineState: 'DEPOT' },

]

/////Blocks of line 7///////////////

const line7LTEs = [
    //////////////////////////// line7 UP/////////////////////////////////////////////////
    { block: 'B1', name: "1", locid: "", lineState: "MAINLINE", SDD: "2" },
    { block: 'B2', name: "2", locid: "", lineState: "MAINLINE", SDD: "4" },
    { block: 'B3', name: "3", locid: "", lineState: "MAINLINE", SDD: "4" },
    { block: 'B4', name: "4", locid: "", lineState: "MAINLINE", SDD: "4" },
    { block: 'B5', name: "5", locid: "", lineState: "MAINLINE", SDD: "4" },
    { block: 'B6', name: "6", locid: "", lineState: "MAINLINE", SDD: "6" },
    { block: 'B7', name: "7", locid: "", lineState: "MAINLINE", SDD: "8" },
    { block: 'B8', name: "8", locid: "", lineState: "MAINLINE", SDD: "10" },
    { block: 'B9', name: "9", locid: "", lineState: "MAINLINE", SDD: "12" },
    { block: 'B10', name: "10", locid: "", lineState: "MAINLINE", SDD: "12" },

    { block: 'B11', name: "11", locid: "", lineState: "MAINLINE", SDD: "14" },
    { block: 'B12', name: "12", locid: "", lineState: "MAINLINE", SDD: "15" },
    { block: 'B13', name: "13", locid: "", lineState: "MAINLINE", SDD: "17" },
    { block: 'B14', name: "14", locid: "", lineState: "MAINLINE", SDD: "19" },
    { block: 'B15', name: "15", locid: "", lineState: "MAINLINE", SDD: "21" },
    { block: 'B16', name: "16", locid: "", lineState: "MAINLINE", SDD: "23" },
    { block: 'B17', name: "17", locid: "", lineState: "MAINLINE", SDD: "25" },
    { block: 'B18', name: "18", locid: "", lineState: "MAINLINE", SDD: "27" },
    { block: 'B19', name: "19", locid: "", lineState: "MAINLINE", SDD: "29" },
    { block: 'B20', name: "20", locid: "", lineState: "MAINLINE", SDD: "31" },
    { block: 'B21', name: "21", locid: "", lineState: "MAINLINE", SDD: "31" },

    { block: 'B22', name: "22", locid: "", lineState: "MAINLINE", SDD: "33" },
    { block: 'B23', name: "23", locid: "", lineState: "MAINLINE", SDD: "35" },
    { block: 'B24', name: "24", locid: "", lineState: "MAINLINE", SDD: "35" },
    { block: 'B25', name: "25", locid: "", lineState: "MAINLINE", SDD: "37" },
    { block: 'B26', name: "26", locid: "", lineState: "MAINLINE", SDD: "39" },
    { block: 'B27', name: "27", locid: "", lineState: "MAINLINE", SDD: "41" },
    { block: 'B28', name: "28", locid: "", lineState: "MAINLINE", SDD: "43" },
    { block: 'B29', name: "29", locid: "", lineState: "MAINLINE", SDD: "45" },
    { block: 'B30', name: "30", locid: "", lineState: "MAINLINE", SDD: "47" },
    { block: 'B31', name: "31", locid: "", lineState: "MAINLINE", SDD: "49" },
    { block: 'B32', name: "32", locid: "", lineState: "MAINLINE", SDD: "51" },
    { block: 'B33', name: "33", locid: "", lineState: "MAINLINE", SDD: "53" },
    { block: 'B34', name: "34", locid: "", lineState: "MAINLINE", SDD: "55" },
    { block: 'B35', name: "35", locid: "", lineState: "MAINLINE", SDD: "57" },
    { block: 'B36', name: "36", locid: "", lineState: "MAINLINE", SDD: "59" },

    { block: 'B37', name: "37", locid: "", lineState: "MAINLINE", SDD: "61" },
    { block: 'B38', name: "38", locid: "", lineState: "MAINLINE", SDD: "63" },
    { block: 'B39', name: "39", locid: "", lineState: "MAINLINE", SDD: "65" },
    { block: 'B40', name: "40", locid: "", lineState: "MAINLINE", SDD: "67" },
    { block: 'B41', name: "41", locid: "", lineState: "MAINLINE", SDD: "69" },
    { block: 'B42', name: "42", locid: "", lineState: "MAINLINE", SDD: "71" },
    { block: 'B43', name: "43", locid: "", lineState: "MAINLINE", SDD: "73" },
    { block: 'B44', name: "44", locid: "", lineState: "MAINLINE", SDD: "73" },

    { block: 'B45', name: "45", locid: "", lineState: "MAINLINE", SDD: "75" },
    { block: 'B46', name: "46", locid: "", lineState: "MAINLINE", SDD: "75" },
    { block: 'B47', name: "47", locid: "", lineState: "MAINLINE", SDD: "75" },
    { block: 'B48', name: "48", locid: "", lineState: "MAINLINE", SDD: "75" },
    { block: 'B49', name: "49", locid: "", lineState: "MAINLINE", SDD: "76" },
    //////////////////////////// line7 DN/////////////////////////////////////////////////
    { block: 'B50', name: "50", locid: "", lineState: "MAINLINE", SDD: "1" },
    { block: 'B51', name: "51", locid: "", lineState: "MAINLINE", SDD: "3" },
    { block: 'B52', name: "52", locid: "", lineState: "MAINLINE", SDD: "3" },
    { block: 'B53', name: "53", locid: "", lineState: "MAINLINE", SDD: "3" },
    { block: 'B54', name: "54", locid: "", lineState: "MAINLINE", SDD: "3" },
    { block: 'B55', name: "55", locid: "", lineState: "MAINLINE", SDD: "5" },
    { block: 'B56', name: "56", locid: "", lineState: "MAINLINE", SDD: "7" },
    { block: 'B57', name: "57", locid: "", lineState: "MAINLINE", SDD: "9" },
    { block: 'B58', name: "58", locid: "", lineState: "MAINLINE", SDD: "11" },
    { block: 'B59', name: "59", locid: "", lineState: "MAINLINE", SDD: "11" },
    { block: 'B60', name: "60", locid: "", lineState: "MAINLINE", SDD: "13" },
    { block: 'B61', name: "61", locid: "", lineState: "MAINLINE", SDD: "16" },
    { block: 'B62', name: "62", locid: "", lineState: "MAINLINE", SDD: "18" },
    { block: 'B63', name: "63", locid: "", lineState: "MAINLINE", SDD: "20" },
    { block: 'B64', name: "64", locid: "", lineState: "MAINLINE", SDD: "22" },
    { block: 'B65', name: "65", locid: "", lineState: "MAINLINE", SDD: "24" },
    { block: 'B66', name: "66", locid: "", lineState: "MAINLINE", SDD: "26" },
    { block: 'B67', name: "67", locid: "", lineState: "MAINLINE", SDD: "28" },
    { block: 'B68', name: "68", locid: "", lineState: "MAINLINE", SDD: "30" },
    { block: 'B69', name: "69", locid: "", lineState: "MAINLINE", SDD: "30" },
    { block: 'B70', name: "70", locid: "", lineState: "MAINLINE", SDD: "32" },
    { block: 'B71', name: "71", locid: "", lineState: "MAINLINE", SDD: "34" },
    { block: 'B72', name: "72", locid: "", lineState: "MAINLINE", SDD: "34" },
    { block: 'B73', name: "73", locid: "", lineState: "MAINLINE", SDD: "36" },
    { block: 'B74', name: "74", locid: "", lineState: "MAINLINE", SDD: "38" },
    { block: 'B75', name: "75", locid: "", lineState: "MAINLINE", SDD: "40" },
    { block: 'B76', name: "76", locid: "", lineState: "MAINLINE", SDD: "42" },
    { block: 'B77', name: "77", locid: "", lineState: "MAINLINE", SDD: "44" },
    { block: 'B78', name: "78", locid: "", lineState: "MAINLINE", SDD: "46" },
    { block: 'B79', name: "79", locid: "", lineState: "MAINLINE", SDD: "48" },
    { block: 'B80', name: "80", locid: "", lineState: "MAINLINE", SDD: "50" },
    { block: 'B81', name: "81", locid: "", lineState: "MAINLINE", SDD: "52" },
    { block: 'B82', name: "82", locid: "", lineState: "MAINLINE", SDD: "54" },
    { block: 'B83', name: "83", locid: "", lineState: "MAINLINE", SDD: "56" },
    { block: 'B84', name: "84", locid: "", lineState: "MAINLINE", SDD: "58" },
    { block: 'B85', name: "85", locid: "", lineState: "MAINLINE", SDD: "60" },
    { block: 'B86', name: "86", locid: "", lineState: "MAINLINE", SDD: "62" },
    { block: 'B87', name: "87", locid: "", lineState: "MAINLINE", SDD: "64" },
    { block: 'B88', name: "88", locid: "", lineState: "MAINLINE", SDD: "66" },
    { block: 'B89', name: "89", locid: "", lineState: "MAINLINE", SDD: "68" },
    { block: 'B90', name: "90", locid: "", lineState: "MAINLINE", SDD: "70" },
    { block: 'B91', name: "91", locid: "", lineState: "MAINLINE", SDD: "72" },
    { block: 'B92', name: "92", locid: "", lineState: "MAINLINE", SDD: "72" },
    { block: 'B93', name: "93", locid: "", lineState: "MAINLINE", SDD: "74" },
    ////////////////////////////INTA TRACK/////////////////////////
    // {name : 'B225', locid:"",lineState:"MAINLINE" , SDD:"1"},
    // {name : 'B226', locid:"",lineState:"MAINLINE" , SDD:"1"},
    // {name : 'B223', locid:"",lineState:"MAINLINE" , SDD:"1"},
    // {name : 'B224', locid:"",lineState:"MAINLINE" , SDD:"1"},
    // {name : 'B221', locid:"",lineState:"MAINLINE" , SDD:"1"},
    // {name : 'B222', locid:"",lineState:"MAINLINE" , SDD:"1"},
    // {name : 'B215', locid:"",lineState:"MAINLINE" , SDD:"1"},
    // {name : 'B216', locid:"",lineState:"MAINLINE" , SDD:"1"},

];



const orangeLineLTE = [

    //////////////////////////// line7 UP/////////////////////////////////////////////////
    { name: 'B1', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B2', station: null, VPF: null, diverging: "B2", siding: null },
    { name: 'B3', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B4', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B5', station: null, VPF: null, diverging: "B15", siding: null },
    { name: 'B6', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B7', station: 'GUN', VPF: null, diverging: null, siding: null },
    { name: 'B8', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B9', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B10', station: null, VPF: null, diverging: "B10", siding: null },
    { name: 'B11', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B12', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B13', station: "MOG", VPF: null, diverging: null, siding: null },
    { name: 'B14', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B15', station: 'JOE', VPF: null, diverging: null, siding: null },
    { name: 'B16', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B17', station: "GOE", VPF: null, diverging: null, siding: null },
    { name: 'B18', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B19', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B20', station: null, VPF: null, diverging: "B20", siding: null },
    { name: 'B21', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B22', station: 'AAR', VPF: null, diverging: null, siding: null },
    { name: 'B23', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B24', station: null, VPF: null, diverging: "B24", siding: null },
    { name: 'B25', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B26', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B27', station: 'DIN', VPF: null, diverging: null, siding: null },
    { name: 'B28', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B29', station: "KUR", VPF: null, diverging: null, siding: null },
    { name: 'B30', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B31', station: "AKU", VPF: null, diverging: null, siding: null },
    { name: 'B32', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B33', station: "POI", VPF: null, diverging: null, siding: null },
    { name: 'B34', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B35', station: "MAG", VPF: null, diverging: null, siding: null },
    { name: 'B36', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B37', station: "DEV", VPF: null, diverging: null, siding: null },
    { name: 'B38', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B39', station: "RAU", VPF: null, diverging: null, siding: null },
    { name: 'B40', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B41', station: "OVA", VPF: null, diverging: null, siding: null },
    { name: 'B42', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B43', station: null, VPF: null, diverging: "B43", siding: null },
    { name: 'B44', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B45', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B46', station: null, VPF: null, diverging: "B46", siding: null },
    { name: 'B47', station: null, VPF: null, diverging: "B47", siding: null },
    { name: 'B48', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B49', station: null, VPF: null, diverging: null, siding: null },
    //////////////////////////// line7 DN/////////////////////////////////////////////////
    { name: 'B50', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B51', station: null, VPF: null, diverging: "B51", siding: null },
    { name: 'B52', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B53', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B54', station: null, VPF: null, diverging: "B54", siding: null },
    { name: 'B55', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B56', station: "GUN", VPF: null, diverging: null, siding: null },
    { name: 'B57', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B58', station: null, VPF: null, diverging: "B58", siding: null },
    { name: 'B59', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B60', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B61', station: "MOG", VPF: null, diverging: null, siding: null },
    { name: 'B62', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B63', station: "JOE", VPF: null, diverging: null, siding: null },
    { name: 'B64', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B65', station: "GOE", VPF: null, diverging: null, siding: null },
    { name: 'B66', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B67', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B68', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B69', station: null, VPF: null, diverging: "B69", siding: null },
    { name: 'B70', station: "AAR", VPF: null, diverging: null, siding: null },
    { name: 'B71', station: null, VPF: null, diverging: "B71", siding: null },
    { name: 'B72', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B73', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B74', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B75', station: "DIN", VPF: null, diverging: null, siding: null },
    { name: 'B76', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B77', station: "KUR", VPF: null, diverging: null, siding: null },
    { name: 'B78', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B79', station: "AKU", VPF: null, diverging: null, siding: null },
    { name: 'B80', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B81', station: "POI", VPF: null, diverging: null, siding: null },
    { name: 'B82', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B83', station: "MAG", VPF: null, diverging: null, siding: null },
    { name: 'B84', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B85', station: "DEV", VPF: null, diverging: null, siding: null },
    { name: 'B86', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B87', station: "RAU", VPF: null, diverging: null, siding: null },
    { name: 'B88', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B89', station: "OVA", VPF: null, diverging: null, siding: null },
    { name: 'B90', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B91', station: null, VPF: null, diverging: "B91", siding: null },
    { name: 'B92', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B93', station: null, VPF: null, diverging: null, siding: null },

];


const line2LTEs = [
    //////////////////////////// line7 Down/////////////////////////////////////////////////
    { block: 'B161', name: "161", SddID: "81", locid: "", lineState: "MAINLINE", SDD: "2AT4401" },
    { block: 'B162', name: "162", SddID: "83", locid: "", lineState: "MAINLINE", SDD: "2AT4403" },
    { block: 'B163', name: "163", SddID: "83", locid: "", lineState: "MAINLINE", SDD: "2AT4403" },
    //{ SddID: 'B230', locid: "", lineState: "MAINLINE", SDD: "2AT4403" },
    { block: 'B164', name: "164", SddID: "85", locid: "", lineState: "MAINLINE", SDD: "2AT4405" },
    { block: 'B165', name: "165", SddID: "87", locid: "", lineState: "MAINLINE", SDD: "2AT4407" },
    { block: 'B166', name: "166", SddID: "87", locid: "", lineState: "MAINLINE", SDD: "2AT4407" },
    // { SddID: 'B231', locid: "", lineState: "MAINLINE", SDD: "2AT4407" },
    { block: 'B167', name: "167", SddID: "89", locid: "", lineState: "MAINLINE", SDD: "2AT4409" },
    { block: 'B168', name: "168", SddID: "91", locid: "", lineState: "MAINLINE", SDD: "2AT4411" },
    { block: 'B169', name: "169", SddID: "93", locid: "", lineState: "MAINLINE", SDD: "2AT4501" },

    { block: 'B170', name: "170", SddID: "95", locid: "", lineState: "MAINLINE", SDD: "2AT4503" },
    { block: 'B171', name: "171", SddID: "97", locid: "", lineState: "MAINLINE", SDD: "2AT4601" },
    { block: 'B172', name: "172", SddID: "99", locid: "", lineState: "MAINLINE", SDD: "2AT4603" },
    { block: 'B173', name: "173", SddID: "101", locid: "", lineState: "MAINLINE", SDD: "2AT4701" },
    { block: 'B174', name: "174", SddID: "103", locid: "", lineState: "MAINLINE", SDD: "2AT4703" },
    { block: 'B175', name: "175", SddID: "105", locid: "", lineState: "MAINLINE", SDD: "2AT4801" },
    { block: 'B176', name: "176", SddID: "107", locid: "", lineState: "MAINLINE", SDD: "2AT4803" },
    { block: 'B177', name: "177", SddID: "109", locid: "", lineState: "MAINLINE", SDD: "2AT4901" },
    { block: 'B178', name: "178", SddID: "111", locid: "", lineState: "MAINLINE", SDD: "2AT4903" },
    { block: 'B179', name: "179", SddID: "113", locid: "", lineState: "MAINLINE", SDD: "2AT5001" },
    { block: 'B180', name: "180", SddID: "115", locid: "", lineState: "MAINLINE", SDD: "2AT5003" },

    { block: 'B181', name: "181", SddID: "117", locid: "", lineState: "MAINLINE", SDD: "2AT5101" },
    { block: 'B182', name: "182", SddID: "119", locid: "", lineState: "MAINLINE", SDD: "2AT5103" },
    { block: 'B183', name: "183", SddID: "121", locid: "", lineState: "MAINLINE", SDD: "2AT5201" },
    { block: 'B184', name: "184", SddID: "123", locid: "", lineState: "MAINLINE", SDD: "2AT5203" },
    { block: 'B185', name: "185", SddID: "123", locid: "", lineState: "MAINLINE", SDD: "2AT5203" },
    // { SddID: 'B233', locid: "", lineState: "MAINLINE", SDD: "2AT5203" },
    { block: 'B186', name: "186", SddID: "125", locid: "", lineState: "MAINLINE", SDD: "2AT5205" },
    { block: 'B187', name: "187", SddID: "127", locid: "", lineState: "MAINLINE", SDD: "2AT5207" },
    { block: 'B188', name: "188", SddID: "129", locid: "", lineState: "MAINLINE", SDD: "2AT5209" },
    { block: 'B189', name: "189", SddID: "129", locid: "", lineState: "MAINLINE", SDD: "2AT5209" },
    // { SddID: 'B235', locid: "", lineState: "MAINLINE", SDD: "2AT5209" },
    { block: 'B190', name: "190", SddID: "131", locid: "", lineState: "MAINLINE", SDD: "2AT5211" },

    { block: 'B191', name: "191", SddID: "133", locid: "", lineState: "MAINLINE", SDD: "2AT5213" },
    { block: 'B192', name: "192", SddID: "148", locid: "", lineState: "MAINLINE", SDD: "2AT5301" },
    { block: 'B193', name: "193", SddID: "150", locid: "", lineState: "MAINLINE", SDD: "2AT5303" },
    { block: 'B194', name: "194", SddID: "152", locid: "", lineState: "MAINLINE", SDD: "2AT5401" },
    { block: 'B195', name: "195", SddID: "154", locid: "", lineState: "MAINLINE", SDD: "2AT5403" },
    { block: 'B196', name: "196", SddID: "156", locid: "", lineState: "MAINLINE", SDD: "2AT5501" },
    { block: 'B197', name: "197", SddID: "158", locid: "", lineState: "MAINLINE", SDD: "2AT5503" },
    { block: 'B198', name: "198", SddID: "160", locid: "", lineState: "MAINLINE", SDD: "2AT5601" },
    { block: 'B199', name: "199", SddID: "162", locid: "", lineState: "MAINLINE", SDD: "2AT5603" },
    { block: 'B200', name: "200", SddID: "164", locid: "", lineState: "MAINLINE", SDD: "2AT5701" },

    { block: 'B201', name: "201", SddID: "166", locid: "", lineState: "MAINLINE", SDD: "2AT5703" },
    { block: 'B202', name: "202", SddID: "168", locid: "", lineState: "MAINLINE", SDD: "2AT5801" },
    { block: 'B203', name: "203", SddID: "170", locid: "", lineState: "MAINLINE", SDD: "2AT5803" },
    { block: 'B204', name: "204", SddID: "172", locid: "", lineState: "MAINLINE", SDD: "2AT5901" },
    { block: 'B205', name: "205", SddID: "174", locid: "", lineState: "MAINLINE", SDD: "2AT5903" },
    { block: 'B206', name: "206", SddID: "176", locid: "", lineState: "MAINLINE", SDD: "2AT6001" },
    { block: 'B207', name: "207", SddID: "178", locid: "", lineState: "MAINLINE", SDD: "2AT6003" },
    { block: 'B208', name: "208", SddID: "178", locid: "", lineState: "MAINLINE", SDD: "2AT6003" },
    { block: 'B209', name: "209", SddID: "180", locid: "", lineState: "MAINLINE", SDD: "2AT6005" },
    { block: 'B210', name: "210", SddID: "182", locid: "", lineState: "MAINLINE", SDD: "2AT6007" },

    { block: 'B211', name: "211", SddID: "184", locid: "", lineState: "MAINLINE", SDD: "2AT6009" },
    { block: 'B212', name: "212", SddID: "186", locid: "", lineState: "MAINLINE", SDD: "2AT6011" },
    { block: 'B213', name: "213", SddID: "186", locid: "", lineState: "MAINLINE", SDD: "2AT6011" },
    { block: 'B248', name: "248", SddID: "186", locid: "", lineState: "MAINLINE", SDD: "2AT6011" },
    { block: 'B214', name: "214", SddID: "188", locid: "", lineState: "MAINLINE", SDD: "2AT6013" },

    ///////////////////////////////////////////Line2 UP/////////////////////////////

    { block: 'B101', name: "101", SddID: "82", locid: "", lineState: "MAINLINE", SDD: "2AT4402" },
    { block: 'B102', name: "102", SddID: "84", locid: "", lineState: "MAINLINE", SDD: "2AT4404" },
    { block: 'B103', name: "103", SddID: "84", locid: "", lineState: "MAINLINE", SDD: "2AT4404" },
    // { SddID: 'B229', locid: "", lineState: "MAINLINE", SDD: "2AT4404" },
    { block: 'B104', name: "104", SddID: "86", locid: "", lineState: "MAINLINE", SDD: "2AT4406" },
    { block: 'B105', name: "105", SddID: "88", locid: "", lineState: "MAINLINE", SDD: "2AT4408" },
    { block: 'B106', name: "106", SddID: "88", locid: "", lineState: "MAINLINE", SDD: "2AT4408" },
    // { SddID: 'B232', locid: "", lineState: "MAINLINE", SDD: "2AT4408" },
    { block: 'B107', name: "107", SddID: "90", locid: "", lineState: "MAINLINE", SDD: "2AT4410" },
    { block: 'B108', name: "108", SddID: "90", locid: "", lineState: "MAINLINE", SDD: "2AT4410" },
    { block: 'B109', name: "109", SddID: "94", locid: "", lineState: "MAINLINE", SDD: "2AT4502" },
    { block: 'B110', name: "110", SddID: "96", locid: "", lineState: "MAINLINE", SDD: "2AT4504" },

    { block: 'B111', name: "111", SddID: "98", locid: "", lineState: "MAINLINE", SDD: "2AT4602" },
    { block: 'B112', name: "112", SddID: "100", locid: "", lineState: "MAINLINE", SDD: "2AT4604" },
    { block: 'B113', name: "113", SddID: "102", locid: "", lineState: "MAINLINE", SDD: "2AT4702" },
    { block: 'B114', name: "114", SddID: "104", locid: "", lineState: "MAINLINE", SDD: "2AT4704" },
    { block: 'B115', name: "115", SddID: "106", locid: "", lineState: "MAINLINE", SDD: "2AT4802" },
    { block: 'B116', name: "116", SddID: "108", locid: "", lineState: "MAINLINE", SDD: "2AT4804" },
    { block: 'B117', name: "117", SddID: "110", locid: "", lineState: "MAINLINE", SDD: "2AT4902" },
    { block: 'B118', name: "118", SddID: "112", locid: "", lineState: "MAINLINE", SDD: "2AT4904" },
    { block: 'B119', name: "119", SddID: "114", locid: "", lineState: "MAINLINE", SDD: "2AT5002" },
    { block: 'B120', name: "120", SddID: "116", locid: "", lineState: "MAINLINE", SDD: "2AT5004" },

    { block: 'B121', name: "121", SddID: "118", locid: "", lineState: "MAINLINE", SDD: "2AT5102" },
    { block: 'B122', name: "122", SddID: "120", locid: "", lineState: "MAINLINE", SDD: "2AT5104" },
    { block: 'B123', name: "123", SddID: "122", locid: "", lineState: "MAINLINE", SDD: "2AT5202" },
    { block: 'B124', name: "124", SddID: "122", locid: "", lineState: "MAINLINE", SDD: "2AT5202" },
    { block: 'B125', name: "125", SddID: "122", locid: "", lineState: "MAINLINE", SDD: "2AT5202" },
    { block: 'B126', name: "126", SddID: "122", locid: "", lineState: "MAINLINE", SDD: "2AT5202" },
    // { SddID: 'B234', locid: "", lineState: "MAINLINE", SDD: "2AT5202" },
    // { SddID: 'B237', locid: "", lineState: "MAINLINE", SDD: "2AT5202" },
    //{ SddID: 'B238', locid: "", lineState: "MAINLINE", SDD: "2AT5220" },
    //{ SddID: 'B249', locid: "", lineState: "MAINLINE", SDD: "2AT5220" },
    // { SddID: 'B250', locid: "", lineState: "MAINLINE", SDD: "2AT5220" },
    //{ SddID: 'B251', name:"251", locid: "", lineState: "MAINLINE", SDD: "2AT5220" },
    { block: 'B127', name: "127", SddID: "124", locid: "", lineState: "MAINLINE", SDD: "2AT5204" },
    { block: 'B128', name: "128", SddID: "126", locid: "", lineState: "MAINLINE", SDD: "2AT5206" },
    { block: 'B129', name: "129", SddID: "128", locid: "", lineState: "MAINLINE", SDD: "2AT5208" },
    { block: 'B130', name: "130", SddID: "128", locid: "", lineState: "MAINLINE", SDD: "2AT5208" },

    //{ SddID: 'B239', locid: "", lineState: "MAINLINE", SDD: "2AT5208" },
    { block: 'B240', name: "240", SddID: "143", locid: "", lineState: "MAINLINE", SDD: "2AT5226" },
    { block: 'B251', name: "251", SddID: "143", locid: "", lineState: "MAINLINE", SDD: "2AT5226" },
    { block: 'B252', name: "252", SddID: "141", locid: "", lineState: "MAINLINE", SDD: "2AT5222" },
    { block: 'B253', name: "253", SddID: "142", locid: "", lineState: "MAINLINE", SDD: "2AT5224" },
    { block: 'B254', name: "254", SddID: "142", locid: "", lineState: "MAINLINE", SDD: "2AT5224" },
    { block: 'B255', name: "255", SddID: "142", locid: "", lineState: "MAINLINE", SDD: "2AT5224" },

    { block: 'B131', name: "131", SddID: "130", locid: "", lineState: "MAINLINE", SDD: "2AT5210" },
    { block: 'B132', name: "132", SddID: "130", locid: "", lineState: "MAINLINE", SDD: "2AT5210" },
    //{ SddID: 'B236', locid: "", lineState: "MAINLINE", SDD: "2AT5210" },
    { block: 'B133', name: "133", SddID: "132", locid: "", lineState: "MAINLINE", SDD: "2AT5212" },
    { block: 'B134', name: "134", SddID: "134", locid: "", lineState: "MAINLINE", SDD: "2AT5214" },
    { block: 'B135', name: "135", SddID: "134", locid: "", lineState: "MAINLINE", SDD: "2AT5214" },
    // { SddID: 'B241', locid: "", lineState: "MAINLINE", SDD: "2AT5214" },
    { block: 'B242', name: "242", SddID: "135", locid: "", lineState: "MAINLINE", SDD: "2AT5215" },
    { block: 'B243', name: "243", SddID: "135", locid: "", lineState: "MAINLINE", SDD: "2AT5215" },
    { block: 'B262', name: "262", SddID: "135", locid: "", lineState: "MAINLINE", SDD: "2AT5215" },
    { block: 'B263', name: "263", SddID: "135", locid: "", lineState: "MAINLINE", SDD: "2AT5215" },
    { block: 'B264', name: "264", SddID: "135", locid: "", lineState: "MAINLINE", SDD: "2AT5215" },
    { block: 'B265', name: "265", SddID: "135", locid: "", lineState: "MAINLINE", SDD: "2AT5215" },
    { block: 'B266', name: "266", SddID: "135", locid: "", lineState: "MAINLINE", SDD: "2AT5215" },

    { block: 'B136', name: "136", SddID: "136", locid: "", lineState: "MAINLINE", SDD: "2AT5216" },
    { block: 'B137', name: "137", SddID: "137", locid: "", lineState: "MAINLINE", SDD: "2AT5218" },

    { block: 'B256', name: "256", SddID: "144", locid: "", lineState: "MAINLINE", SDD: "2AT5228" },
    { block: 'B244', name: "244", SddID: "145", locid: "", lineState: "MAINLINE", SDD: "2AT5230" },
    { block: 'B257', name: "257", SddID: "145", locid: "", lineState: "MAINLINE", SDD: "2AT5230" },
    { block: 'B258', name: "258", SddID: "145", locid: "", lineState: "MAINLINE", SDD: "2AT5230" },
    { block: 'B267', name: "267", SddID: "138", locid: "", lineState: "MAINLINE", SDD: "2AT5217" },
    { block: 'B268', name: "268", SddID: "139", locid: "", lineState: "MAINLINE", SDD: "2AT5219" },
    { block: 'B269', name: "269", SddID: "139", locid: "", lineState: "MAINLINE", SDD: "2AT5219" },
    { block: 'B259', name: "259", SddID: "146", locid: "", lineState: "MAINLINE", SDD: "2AT5232" },
    { block: 'B260', name: "260", SddID: "147", locid: "", lineState: "MAINLINE", SDD: "2AT5234" },
    { block: 'B261', name: "261", SddID: "147", locid: "", lineState: "MAINLINE", SDD: "2AT5234" },

    { block: 'B138', name: "138", SddID: "149", locid: "", lineState: "MAINLINE", SDD: "2AT5302" },
    { block: 'B139', name: "139", SddID: "151", locid: "", lineState: "MAINLINE", SDD: "2AT5304" },
    { block: 'B140', name: "140", SddID: "153", locid: "", lineState: "MAINLINE", SDD: "2AT5402" },

    { block: 'B141', name: "141", SddID: "155", locid: "", lineState: "MAINLINE", SDD: "2AT5404" },
    { block: 'B142', name: "142", SddID: "157", locid: "", lineState: "MAINLINE", SDD: "2AT5502" },
    { block: 'B143', name: "143", SddID: "159", locid: "", lineState: "MAINLINE", SDD: "2AT5504" },
    { block: 'B144', name: "144", SddID: "161", locid: "", lineState: "MAINLINE", SDD: "2AT5602" },
    { block: 'B145', name: "145", SddID: "163", locid: "", lineState: "MAINLINE", SDD: "2AT5604" },
    { block: 'B146', name: "146", SddID: "165", locid: "", lineState: "MAINLINE", SDD: "2AT5702" },
    { block: 'B147', name: "147", SddID: "167", locid: "", lineState: "MAINLINE", SDD: "2AT5704" },
    { block: 'B148', name: "148", SddID: "169", locid: "", lineState: "MAINLINE", SDD: "2AT5802" },
    { block: 'B149', name: "149", SddID: "171", locid: "", lineState: "MAINLINE", SDD: "2AT5804" },
    { block: 'B150', name: "150", SddID: "173", locid: "", lineState: "MAINLINE", SDD: "2AT5902" },

    { block: 'B151', name: "151", SddID: "175", locid: "", lineState: "MAINLINE", SDD: "2AT5904" },
    { block: 'B152', name: "152", SddID: "177", locid: "", lineState: "MAINLINE", SDD: "2AT6002" },
    { block: 'B153', name: "153", SddID: "179", locid: "", lineState: "MAINLINE", SDD: "2AT6004" },
    { block: 'B154', name: "154", SddID: "179", locid: "", lineState: "MAINLINE", SDD: "2AT6004" },
    // { SddID: 'B246', locid: "", lineState: "MAINLINE", SDD: "2AT6004" },
    { block: 'B155', name: "155", SddID: "181", locid: "", lineState: "MAINLINE", SDD: "2AT6006" },
    { block: 'B156', name: "156", SddID: "183", locid: "", lineState: "MAINLINE", SDD: "2AT6008" },
    { block: 'B157', name: "157", SddID: "185", locid: "", lineState: "MAINLINE", SDD: "2AT6010" },
    { block: 'B158', name: "158", SddID: "187", locid: "", lineState: "MAINLINE", SDD: "2AT6012" },
    { block: 'B159', name: "159", SddID: "187", locid: "", lineState: "MAINLINE", SDD: "2AT6012" },
    { block: 'B247', name: "247", SddID: "187", locid: "", lineState: "MAINLINE", SDD: "2AT6012" },
    { block: 'B160', name: "160", SddID: "189", locid: "", lineState: "MAINLINE", SDD: "2AT6014" },

];

const aquaDepotLTE = [
    //////////////////////////// line7 Down/////////////////////////////////////////////////
    { name: 'B161', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B162', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B163', station: null, VPF: null, diverging: "B163", siding: null },
    { name: 'B230', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B164', station: "DAE", VPF: null, diverging: null, siding: null },
    { name: 'B165', station: null, VPF: null, diverging: "B165", siding: null },
    { name: 'B166', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B231', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B167', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B168', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B169', station: "UPD", VPF: null, diverging: null, siding: null },

    { name: 'B170', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B171', station: "KAN", VPF: null, diverging: null, siding: null },
    { name: 'B172', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B173', station: "MAN", VPF: null, diverging: null, siding: null },
    { name: 'B174', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B175', station: "EKS", VPF: null, diverging: null, siding: null },
    { name: 'B176', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B177', station: "BOW", VPF: null, diverging: null, siding: null },
    { name: 'B178', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B179', station: "PAE", VPF: null, diverging: null, siding: null },
    { name: 'B180', station: null, VPF: null, diverging: null, siding: null },

    { name: 'B181', station: "KAW", VPF: null, diverging: null, siding: null },
    { name: 'B182', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B183', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B184', station: null, VPF: null, diverging: "B184", siding: null },
    { name: 'B185', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B233', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B186', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B187', station: "DAH", VPF: null, diverging: null, siding: null },
    { name: 'B188', station: null, VPF: null, diverging: "B188", siding: null },
    { name: 'B189', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B235', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B190', station: null, VPF: null, diverging: null, siding: null },

    { name: 'B191', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B192', station: "VAL", VPF: null, diverging: null, siding: null },
    { name: 'B193', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B194', station: "MAW", VPF: null, diverging: null, siding: null },
    { name: 'B195', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B196', station: "LOM", VPF: null, diverging: null, siding: null },
    { name: 'B197', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B198', station: "PAG", VPF: null, diverging: null, siding: null },
    { name: 'B199', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B200', station: "GOW", VPF: null, diverging: null, siding: null },

    { name: 'B201', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B202', station: "OSH", VPF: null, diverging: null, siding: null },
    { name: 'B203', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B204', station: "LOO", VPF: null, diverging: null, siding: null },
    { name: 'B205', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B206', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B207', station: null, VPF: null, diverging: "B207", siding: null },
    { name: 'B208', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B209', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B210', station: "ANW", VPF: null, diverging: null, siding: null },

    { name: 'B211', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B212', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B213', station: null, VPF: null, diverging: "B213", siding: null },
    { name: 'B248', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B214', station: null, VPF: null, diverging: null, siding: null },

    ///////////////////////////////////////////Line2 UP/////////////////////////////

    { name: 'B101', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B102', station: null, VPF: null, diverging: "B102", siding: null },
    { name: 'B103', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B229', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B104', station: "DAE", VPF: null, diverging: null, siding: null },
    { name: 'B105', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B106', station: null, VPF: null, diverging: "B106", siding: null },
    { name: 'B232', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B107', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B108', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B109', station: "UPD", VPF: null, diverging: null, siding: null },
    { name: 'B110', station: null, VPF: null, diverging: null, siding: null },

    { name: 'B111', station: "KAN", VPF: null, diverging: null, siding: null },
    { name: 'B112', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B113', station: "MAN", VPF: null, diverging: null, siding: null },
    { name: 'B114', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B115', station: "EKS", VPF: null, diverging: null, siding: null },
    { name: 'B116', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B117', station: "BOW", VPF: null, diverging: null, siding: null },
    { name: 'B118', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B119', station: "PAE", VPF: null, diverging: null, siding: null },
    { name: 'B120', station: null, VPF: null, diverging: null, siding: null },

    { name: 'B121', station: "KAW", VPF: null, diverging: null, siding: null },
    { name: 'B122', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B123', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B124', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B125', station: null, VPF: null, diverging: "B125", siding: null },
    { name: 'B126', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B234', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B237', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B238', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B249', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B250', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B251', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B127', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B128', station: "DAH", VPF: null, diverging: null, siding: null },
    { name: 'B129', station: null, VPF: null, diverging: "B129", siding: null },
    { name: 'B130', station: null, VPF: null, diverging: null, siding: null },

    { name: 'B239', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B240', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B255', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B252', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B253', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B254', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B255', station: null, VPF: null, diverging: null, siding: null },

    { name: 'B131', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B132', station: null, VPF: null, diverging: "B132", siding: null },
    { name: 'B236', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B133', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B134', station: null, VPF: null, diverging: "B134", siding: null },
    { name: 'B135', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B241', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B242', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B243', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B262', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B263', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B264', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B265', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B266', station: null, VPF: null, diverging: null, siding: null },

    { name: 'B136', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B137', station: null, VPF: null, diverging: null, siding: null },

    { name: 'B256', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B244', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B257', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B258', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B267', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B268', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B269', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B259', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B260', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B261', station: null, VPF: null, diverging: null, siding: null },

    { name: 'B138', station: "VAL", VPF: null, diverging: null, siding: null },
    { name: 'B139', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B140', station: "MAW", VPF: null, diverging: null, siding: null },

    { name: 'B141', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B142', station: "LOM", VPF: null, diverging: null, siding: null },
    { name: 'B143', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B144', station: "PAG", VPF: null, diverging: null, siding: null },
    { name: 'B145', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B146', station: "GOW", VPF: null, diverging: null, siding: null },
    { name: 'B147', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B148', station: "OSH", VPF: null, diverging: null, siding: null },
    { name: 'B149', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B150', station: "LOO", VPF: null, diverging: null, siding: null },

    { name: 'B151', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B152', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B153', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B154', station: null, VPF: null, diverging: "B154", siding: null },
    { name: 'B246', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B155', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B156', station: "ANW", VPF: null, diverging: null, siding: null },
    { name: 'B157', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B158', station: null, VPF: null, diverging: "B158", siding: null },
    { name: 'B159', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B247', station: null, VPF: null, diverging: null, siding: null },
    { name: 'B160', station: null, VPF: null, diverging: null, siding: null },

];

const trains = [
    { rakeId: '2001', PTID_A: '32768', PTID_B: '32769', RadioID_A: '100101', RadioID_B: '100102', livePaId: '1000401' },
    { rakeId: '2002', PTID_A: '32768', PTID_B: '32769', RadioID_A: '100201', RadioID_B: '100202', livePaId: '1000401' },
    { rakeId: '2003', PTID_A: '32768', PTID_B: '32769', RadioID_A: '100301', RadioID_B: '100302', livePaId: '1000401' },
    { rakeId: '2004', PTID_A: '32768', PTID_B: '32769', RadioID_A: '100401', RadioID_B: '100402', livePaId: '1000401' },
    { rakeId: '2005', PTID_A: '32768', PTID_B: '32769', RadioID_A: '100501', RadioID_B: '100502', livePaId: '1000401' },
    { rakeId: '2006', PTID_A: '32768', PTID_B: '32769', RadioID_A: '100601', RadioID_B: '100602', livePaId: '1000401' },
    { rakeId: '2007', PTID_A: '32768', PTID_B: '32769', RadioID_A: '100701', RadioID_B: '100702', livePaId: '1000401' },
    { rakeId: '2008', PTID_A: '32768', PTID_B: '32769', RadioID_A: '100801', RadioID_B: '100802', livePaId: '1000401' },
    { rakeId: '2009', PTID_A: '32768', PTID_B: '32769', RadioID_A: '100901', RadioID_B: '100902', livePaId: '1000401' },
    { rakeId: '2010', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101001', RadioID_B: '101002', livePaId: '1000401' },
    { rakeId: '2011', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101101', RadioID_B: '101102', livePaId: '1000401' },
    { rakeId: '2012', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101201', RadioID_B: '101202', livePaId: '1000401' },
    { rakeId: '2013', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101301', RadioID_B: '101302', livePaId: '1000401' },
    { rakeId: '2014', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101401', RadioID_B: '101402', livePaId: '1000401' },
    { rakeId: '2015', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101501', RadioID_B: '101502', livePaId: '1000401' },
    { rakeId: '2016', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101601', RadioID_B: '101602', livePaId: '1000401' },
    { rakeId: '2017', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101701', RadioID_B: '101702', livePaId: '1000401' },
    { rakeId: '2018', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101801', RadioID_B: '101802', livePaId: '1000401' },
    { rakeId: '2019', PTID_A: '32768', PTID_B: '32769', RadioID_A: '101901', RadioID_B: '101902', livePaId: '1000401' },
    { rakeId: '2020', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102001', RadioID_B: '102002', livePaId: '1000401' },
    { rakeId: '2021', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102101', RadioID_B: '102102', livePaId: '1000401' },
    { rakeId: '2022', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102201', RadioID_B: '102202', livePaId: '1000401' },
    { rakeId: '2023', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102301', RadioID_B: '102302', livePaId: '1000401' },
    { rakeId: '2024', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102401', RadioID_B: '102402', livePaId: '1000401' },
    { rakeId: '2025', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102501', RadioID_B: '102502', livePaId: '1000401' },
    { rakeId: '2026', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102601', RadioID_B: '102602', livePaId: '1000401' },
    { rakeId: '2027', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102701', RadioID_B: '102702', livePaId: '1000401' },
    { rakeId: '2028', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102801', RadioID_B: '102802', livePaId: '1000401' },
    { rakeId: '2029', PTID_A: '32768', PTID_B: '32769', RadioID_A: '102901', RadioID_B: '102902', livePaId: '1000401' },
    { rakeId: '2030', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103001', RadioID_B: '103002', livePaId: '1000401' },
    { rakeId: '2031', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103101', RadioID_B: '103102', livePaId: '1000401' },
    { rakeId: '2032', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103201', RadioID_B: '103202', livePaId: '1000401' },
    { rakeId: '2033', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103301', RadioID_B: '103302', livePaId: '1000401' },
    { rakeId: '2034', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103401', RadioID_B: '103402', livePaId: '1000401' },
    { rakeId: '2035', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103501', RadioID_B: '103502', livePaId: '1000401' },
    { rakeId: '2036', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103601', RadioID_B: '103602', livePaId: '1000401' },
    { rakeId: '2037', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103701', RadioID_B: '103702', livePaId: '1000401' },
    { rakeId: '2038', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103801', RadioID_B: '103802', livePaId: '1000401' },
    { rakeId: '2039', PTID_A: '32768', PTID_B: '32769', RadioID_A: '103901', RadioID_B: '103902', livePaId: '1000401' },
    { rakeId: '2040', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104001', RadioID_B: '104002', livePaId: '1000401' },
    { rakeId: '2041', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104101', RadioID_B: '104102', livePaId: '1000401' },
    { rakeId: '2042', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104201', RadioID_B: '104202', livePaId: '1000401' },
    { rakeId: '2043', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104301', RadioID_B: '104302', livePaId: '1000401' },
    { rakeId: '2044', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104401', RadioID_B: '104402', livePaId: '1000401' },
    { rakeId: '2045', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104501', RadioID_B: '104502', livePaId: '1000401' },
    { rakeId: '2046', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104601', RadioID_B: '104602', livePaId: '1000401' },
    { rakeId: '2047', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104701', RadioID_B: '104702', livePaId: '1000401' },
    { rakeId: '2048', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104801', RadioID_B: '104802', livePaId: '1000401' },
    { rakeId: '2049', PTID_A: '32768', PTID_B: '32769', RadioID_A: '104901', RadioID_B: '104902', livePaId: '1000401' },
    { rakeId: '2050', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105001', RadioID_B: '105002', livePaId: '1000401' },

    { rakeId: '7001', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105101', RadioID_B: '105102', livePaId: '1000401' },
    { rakeId: '7002', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105201', RadioID_B: '105202', livePaId: '1000401' },
    { rakeId: '7003', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105301', RadioID_B: '105302', livePaId: '1000401' },
    { rakeId: '7004', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105401', RadioID_B: '105402', livePaId: '1000401' },
    { rakeId: '7005', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105501', RadioID_B: '105502', livePaId: '1000401' },
    { rakeId: '7006', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105601', RadioID_B: '105602', livePaId: '1000401' },
    { rakeId: '7007', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105701', RadioID_B: '105702', livePaId: '1000401' },
    { rakeId: '7008', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105801', RadioID_B: '105802', livePaId: '1000401' },
    { rakeId: '7009', PTID_A: '32768', PTID_B: '32769', RadioID_A: '105901', RadioID_B: '105902', livePaId: '1000401' },
    { rakeId: '7010', PTID_A: '32768', PTID_B: '32769', RadioID_A: '106001', RadioID_B: '106002', livePaId: '1000401' },
    { rakeId: '7011', PTID_A: '32768', PTID_B: '32769', RadioID_A: '106101', RadioID_B: '106102', livePaId: '1000401' },
    { rakeId: '7012', PTID_A: '32768', PTID_B: '32769', RadioID_A: '106201', RadioID_B: '106102', livePaId: '1000401' },
    { rakeId: '7013', PTID_A: '32768', PTID_B: '32769', RadioID_A: '106301', RadioID_B: '106302', livePaId: '1000401' },

];

const stationRadios = [
    //LINE 7
    {
        station: 'Gundavli',
        stnCode: 'GUN',
        radio_id: '11010',
    },
    {
        station: 'Mogra',
        stnCode: 'MOG',
        radio_id: '11010',
    }, {
        station: 'Jogeshwari(East)',
        stnCode: 'JOE',
        radio_id: '11010',
    }, {
        station: 'Goregaon',
        stnCode: 'GOE',
        radio_id: '11010',
    }, {
        station: 'Aarey',
        stnCode: 'AAR',
        radio_id: '11010',
    }, {
        station: 'Dindoshi',
        stnCode: 'DIN',
        radio_id: '11010',
    }, {
        station: 'Kurar',
        stnCode: 'KUR',
        radio_id: '11010',
    }, {
        station: 'Akurli',
        stnCode: 'AKU',
        radio_id: '11010',
    }, {
        station: 'Poisar',
        stnCode: 'POI',
        radio_id: '11010',
    }, {
        station: 'Magathane',
        stnCode: 'MAG',
        radio_id: '11010',
    }, {
        station: 'Devipada',
        stnCode: 'DEV',
        radio_id: '11010',
    }, {
        station: 'Rashtriya udyam',
        stnCode: 'RAU',
        radio_id: '11010',
    }, {
        station: 'Ovaripada',
        stnCode: 'OVA',
        radio_id: '11010',
    },
    ///////////////////////////////line 2A////////////////////////
    {
        station: 'Dahisar',
        stnCode: 'DAE',
        radio_id: '11010'
    },
    {
        station: 'Upper Dahisar',
        stnCode: 'UPD',
        radio_id: '11010'

    }, {
        station: 'Kandarpada',
        stnCode: 'KAN',
        radio_id: '11010'

    }, {
        station: 'Mandepeshwar',
        stnCode: 'MAN',
        radio_id: '11010'

    }, {
        station: 'Eksar',
        stnCode: 'EKS',
        radio_id: '11010'

    }, {
        station: 'Borivali west',
        stnCode: 'BOW',
        radio_id: '11010'

    }, {
        station: 'Pahadi Eksar',
        stnCode: 'PAE',
        radio_id: '11010'

    }, {
        station: 'Kandivali West',
        stnCode: 'KAW',
        radio_id: '11010'

    }, {
        station: 'Dahanukarwadi',
        stnCode: 'DAH',
        radio_id: '11010'

    }, {
        station: 'Valnai',
        stnCode: 'VAL',
        radio_id: '11010'

    }, {
        station: 'Malad West',
        stnCode: 'MAW',
        radio_id: '11010'

    }, {
        station: 'Lower Malad',
        stnCode: 'LOM',
        radio_id: '11010'

    }, {
        station: 'Pahadi Goregaon',
        stnCode: 'PAG',
        radio_id: '11010'

    }, {
        station: 'Goreagin West',
        stnCode: 'GOW',
        radio_id: '11010'

    }, {
        station: 'Oshiwara',
        stnCode: 'OSH',
        radio_id: '11010'

    }, {
        station: 'Lower Oshiwara',
        stnCode: 'LOO',
        radio_id: '11010'

    }, {
        station: 'Andher West',
        stnCode: 'ANW',
        radio_id: '11010'

    }

]


const getDiverging = (trackCircuit) => {
    return diverging.filter(tc => tc.name.includes(trackCircuit));
}
const getLTEs = (trackCircuit, Line) => {
    if (trackCircuit !== '') {
        if (Line === 'Line7') {
            return line7LTEs.filter(lte => lte.SDD == trackCircuit);
        } else
            if (Line === 'Line2') {
                return line2LTEs.filter(lte => lte.SDD == trackCircuit);
            }
    } else {
        return null
    }
}

const getStation = (trackCircuit) => {
    if (trackCircuit !== null) {
        return stations.filter(stn => stn.SDDdn == trackCircuit || stn.SDDup == trackCircuit);
    } else {
        return null
    }

}

const diverging = [
    { name: '4', type: 'Changing', prevLTE: 'B51', nextLTE: 'B5', mergingTC: '3' },
    { name: '3', type: 'Changing', prevLTE: 'B50', nextLTE: 'B6', mergingTC: '4' },
    { name: '12', type: 'Changing', prevLTE: 'B58', nextLTE: 'B10', mergingTC: '11' },
    { name: '11', type: 'Changing', prevLTE: 'B10', nextLTE: 'B58', mergingTC: '12' },

    { name: '30', type: 'Changing', prevLTE: 'B20', nextLTE: 'B69', mergingTC: '31' },
    { name: '31', type: 'Changing', prevLTE: 'B69', nextLTE: 'B20', mergingTC: '30' },

    { name: '34', type: 'Changing', prevLTE: 'B24', nextLTE: 'B71', mergingTC: '35' },
    { name: '35', type: 'Changing', prevLTE: 'B71', nextLTE: 'B24', mergingTC: '34' },

    { name: '72', type: 'Changing', prevLTE: 'B91', nextLTE: 'B47', mergingTC: '75' },
    // {name: '75', type: 'Changing', prevLTE:'B91', nextLTE:'B46', mergingTC:'72'},

    { name: '77', type: 'Changing', prevLTE: 'B43', nextLTE: 'B98', mergingTC: '73' },
    // {name: '73', type: 'Changing', prevLTE:'B43', nextLTE:'B98', mergingTC:'77'},
    { name: '73', type: 'Siding', prevLTE: 'B43', nextLTE: 'B227', mergingTC: '77' },
    { name: '75', type: 'Siding', prevLTE: 'B45', nextLTE: 'B95', mergingTC: '78' },
    //////////////////////////////////////////////////Line 2A///////////////////////////////////////////
    { name: '2AT4404', type: 'Changing', prevLTE: 'B102', nextLTE: 'B163', mergingTC: '2AT4403' },
    { name: '2AT4403', type: 'Changing', prevLTE: 'B163', nextLTE: 'B102', mergingTC: '2AT4404' },

    { name: '2AT4408', type: 'Changing', prevLTE: 'B106', nextLTE: 'B165', mergingTC: '2AT4407' },
    { name: '2AT4407', type: 'Changing', prevLTE: 'B165', nextLTE: '106', mergingTC: '2AT4408' },

    { name: '2AT5203', type: 'Changing', prevLTE: 'B184', nextLTE: 'B125', mergingTC: '2AT5202' },
    // { name: '2AT5202', type: 'Changing', prevLTE: 'B125', nextLTE: 'B184', mergingTC: '2AT5203' },

    { name: '2AT5208', type: 'Siding', prevLTE: 'B129', nextLTE: 'B255', mergingTC: '2AT5226' },
    { name: '2AT5214', type: 'Siding', prevLTE: 'B134', nextLTE: 'B264', mergingTC: '2AT5215' },
    { name: '2AT5202', type: 'Siding', prevLTE: 'B125', nextLTE: 'B251', mergingTC: '2AT5220' },

    // {name: '2AT4407', type: 'siding', prevLTE:'165', nextLTE:'106', mergingTC:'2AT4408'},
    // {name: '2AT4408', type: 'siding', prevLTE:'106', nextLTE:'165', mergingTC:'2AT4407'},

    { name: '2AT5210', type: 'Changing', prevLTE: 'B132', nextLTE: 'B188', mergingTC: '2AT5209' },
    { name: '2AT5209', type: 'Changing', prevLTE: 'B188', nextLTE: 'B132', mergingTC: '2AT5210' },

    { name: '2AT5214', type: 'Siding', prevLTE: 'B134', nextLTE: 'B265', mergingTC: '2AT5215' },

    { name: '2AT6004', type: 'Changing', prevLTE: 'B154', nextLTE: 'B207', mergingTC: '2AT6003' },
    { name: '2AT6003', type: 'Changing', prevLTE: 'B207', nextLTE: 'B154', mergingTC: '2AT6004' },

    { name: '2AT6012', type: 'Changing', prevLTE: 'B158', nextLTE: 'B213', mergingTC: '2AT6011' },
    { name: '2AT6011', type: 'Changing', prevLTE: 'B213', nextLTE: 'B158', mergingTC: '2AT6012' },


];


const trackCircuits = [
    [
        ////////////////////////trackCircuit[0] = Contains Line Information of the project/////////////////////////////////////////
        { text: 'Line 7', value: 'Line7', type: 'line', alias: 'Line7' },
        { text: 'Line 2', value: 'Line2', type: 'line', alias: 'Line2' },
        { text: 'Charkop', value: 'depot1', type: 'depot' },
        //  {text:'Mihan Depot', value:'depot2', type:'depot'},
    ],
    [
        /////////////////////////////////trackCircuits[1] = Contains Track Circuit Information of the signalong plan////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////LINE7 DN////////////////////////////////////////////////////////////////////////
        { name: '1', LTEs: getLTEs('1', 'Line7'), station: getStation(null), prevStation: '', nextStation: 'GUN', line: 'Line7', direction: UP, diverging: [] },
        { name: '3', LTEs: getLTEs('3', 'Line7'), station: getStation(null), prevStation: '', nextStation: 'GUN', line: 'Line7', direction: UP, diverging: getDiverging("3") },
        { name: '5', LTEs: getLTEs('5', 'Line7'), station: getStation(null), prevStation: '', nextStation: 'GUN', line: 'Line7', direction: UP, diverging: [] },
        { name: '7', LTEs: getLTEs('7', 'Line7'), station: getStation("7"), prevStation: '', nextStation: 'MOG', line: 'Line7', direction: UP, diverging: [] },
        { name: '9', LTEs: getLTEs('9', 'Line7'), station: getStation(null), prevStation: 'GUN', nextStation: 'MOG', line: 'Line7', direction: UP, diverging: [] },
        { name: '11', LTEs: getLTEs('11', 'Line7'), station: getStation(null), prevStation: 'GUN', nextStation: 'MOG', line: 'Line7', direction: UP, diverging: getDiverging("11") },
        { name: '13', LTEs: getLTEs('13', 'Line7'), station: getStation(null), prevStation: 'GUN', nextStation: 'MOG', line: 'Line7', direction: UP, diverging: [] },
        { name: '16', LTEs: getLTEs('16', 'Line7'), station: getStation("16"), prevStation: '', nextStation: 'JOE', line: 'Line7', direction: UP, diverging: [] },
        { name: '18', LTEs: getLTEs('18', 'Line7'), station: getStation(null), prevStation: 'MOG', nextStation: 'JOE', line: 'Line7', direction: UP, diverging: [] },
        { name: '20', LTEs: getLTEs('20', 'Line7'), station: getStation("20"), prevStation: '', nextStation: 'GOE', line: 'Line7', direction: UP, diverging: [] },
        { name: '22', LTEs: getLTEs('22', 'Line7'), station: getStation(null), prevStation: 'JOE', nextStation: 'GOE', line: 'Line7', direction: UP, diverging: [] },
        { name: '24', LTEs: getLTEs('24', 'Line7'), station: getStation('24'), prevStation: '', nextStation: 'AAR', line: 'Line7', direction: UP, diverging: [] },
        { name: '26', LTEs: getLTEs('26', 'Line7'), station: getStation(null), prevStation: 'GOE', nextStation: "AAR", line: 'Line7', direction: UP, diverging: [] },
        { name: '28', LTEs: getLTEs('28', 'Line7'), station: getStation(null), prevStation: 'GOE', nextStation: "AAR", line: 'Line7', direction: UP, diverging: [] },
        { name: '30', LTEs: getLTEs('30', 'Line7'), station: getStation(null), prevStation: 'GOE', nextStation: "AAR", line: 'Line7', direction: UP, diverging: getDiverging("30") },
        { name: '32', LTEs: getLTEs('32', 'Line7'), station: getStation('32'), prevStation: '', nextStation: 'DIN', line: 'Line7', direction: UP, diverging: [] },
        { name: '34', LTEs: getLTEs('34', 'Line7'), station: getStation(null), prevStation: 'AAR', nextStation: "DIN", line: 'Line7', direction: UP, diverging: getDiverging("34") },
        { name: '36', LTEs: getLTEs('36', 'Line7'), station: getStation(null), prevStation: 'AAR', nextStation: "DIN", line: 'Line7', direction: UP, diverging: [] },
        { name: '38', LTEs: getLTEs('38', 'Line7'), station: getStation(null), prevStation: 'AAR', nextStation: "DIN", line: 'Line7', direction: UP, diverging: [] },
        { name: '40', LTEs: getLTEs('40', 'Line7'), station: getStation('40'), prevStation: '', nextStation: 'KUR', line: 'Line7', direction: UP, diverging: [] },
        { name: '42', LTEs: getLTEs('42', 'Line7'), station: getStation(null), prevStation: 'DIN', nextStation: "KUR", line: 'Line7', direction: UP, diverging: [] },
        { name: '44', LTEs: getLTEs('44', 'Line7'), station: getStation('44'), prevStation: '', nextStation: 'AKU', line: 'Line7', direction: UP, diverging: [] },
        { name: '46', LTEs: getLTEs('46', 'Line7'), station: getStation(null), prevStation: 'KUR', nextStation: "AKU", line: 'Line7', direction: UP, diverging: [] },
        { name: '48', LTEs: getLTEs('48', 'Line7'), station: getStation('48'), prevStation: '', nextStation: 'POI', line: 'Line7', direction: UP, diverging: [] },
        { name: '50', LTEs: getLTEs('50', 'Line7'), station: getStation(null), prevStation: 'AKU', nextStation: "POI", line: 'Line7', direction: UP, diverging: [] },
        { name: '52', LTEs: getLTEs('52', 'Line7'), station: getStation('52'), prevStation: '', nextStation: 'MAG', line: 'Line7', direction: UP, diverging: [] },
        { name: '54', LTEs: getLTEs('54', 'Line7'), station: getStation(null), prevStation: 'POI', nextStation: "MAG", line: 'Line7', direction: UP, diverging: [] },
        { name: '56', LTEs: getLTEs('56', 'Line7'), station: getStation('56'), prevStation: '', nextStation: 'DEV', line: 'Line7', direction: UP, diverging: [] },
        { name: '58', LTEs: getLTEs('58', 'Line7'), station: getStation(null), prevStation: 'MAG', nextStation: "DEV", line: 'Line7', direction: UP, diverging: [] },
        { name: '60', LTEs: getLTEs('60', 'Line7'), station: getStation('60'), prevStation: '', nextStation: 'RAU', line: 'Line7', direction: UP, diverging: [] },
        { name: '62', LTEs: getLTEs('62', 'Line7'), station: getStation(null), prevStation: 'DEV', nextStation: "RAU", line: 'Line7', direction: UP, diverging: [] },
        { name: '64', LTEs: getLTEs('64', 'Line7'), station: getStation('64'), prevStation: '', nextStation: 'OVA', line: 'Line7', direction: UP, diverging: [] },
        { name: '66', LTEs: getLTEs('66', 'Line7'), station: getStation(null), prevStation: 'RAU', nextStation: "OVA", line: 'Line7', direction: UP, diverging: [] },
        { name: '68', LTEs: getLTEs('68', 'Line7'), station: getStation('68'), prevStation: '', nextStation: '', line: 'Line7', direction: UP, diverging: [] },
        { name: '70', LTEs: getLTEs('70', 'Line7'), station: getStation(null), prevStation: 'OVA', nextStation: "", line: 'Line7', direction: UP, diverging: [] },
        { name: '72', LTEs: getLTEs('72', 'Line7'), station: getStation(null), prevStation: 'OVA', nextStation: "", line: 'Line7', direction: UP, diverging: getDiverging("72") },
        { name: '74', LTEs: getLTEs('74', 'Line7'), station: getStation(null), prevStation: 'OVA', nextStation: "", line: 'Line7', direction: UP, diverging: [] },
        ///////////////////////////////////////////////////////////////////UP///////////////////////////////////////////////////////////////////
        { name: '76', LTEs: getLTEs('76', 'Line7'), station: getStation(null), prevStation: '', nextStation: "OVA", line: 'Line7', direction: DN, diverging: [] },
        { name: '75', LTEs: getLTEs('75', 'Line7'), station: getStation(null), prevStation: '', nextStation: "OVA", line: 'Line7', direction: DN, diverging: getDiverging("75") },
        { name: '73', LTEs: getLTEs('73', 'Line7'), station: getStation(null), prevStation: '', nextStation: "OVA", line: 'Line7', direction: DN, diverging: getDiverging("73") },
        { name: '71', LTEs: getLTEs('71', 'Line7'), station: getStation(null), prevStation: '', nextStation: "OVA", line: 'Line7', direction: DN, diverging: [] },
        { name: '69', LTEs: getLTEs('69', 'Line7'), station: getStation('69'), prevStation: '', nextStation: 'RAU', line: 'Line7', direction: DN, diverging: [] },
        { name: '67', LTEs: getLTEs('67', 'Line7'), station: getStation(null), prevStation: 'OVA', nextStation: "RAU", line: 'Line7', direction: DN, diverging: [] },
        { name: '65', LTEs: getLTEs('65', 'Line7'), station: getStation('65'), prevStation: '', nextStation: 'DEV', line: 'Line7', direction: DN, diverging: [] },
        { name: '63', LTEs: getLTEs('63', 'Line7'), station: getStation(null), prevStation: 'RAU', nextStation: "DEV", line: 'Line7', direction: DN, diverging: [] },
        { name: '61', LTEs: getLTEs('61', 'Line7'), station: getStation('61'), prevStation: '', nextStation: 'MAG', line: 'Line7', direction: DN, diverging: [] },
        { name: '59', LTEs: getLTEs('59', 'Line7'), station: getStation(null), prevStation: 'DEV', nextStation: "MAG", line: 'Line7', direction: DN, diverging: [] },
        { name: '57', LTEs: getLTEs('57', 'Line7'), station: getStation('57'), prevStation: '', nextStation: 'POI', line: 'Line7', direction: DN, diverging: [] },
        { name: '55', LTEs: getLTEs('55', 'Line7'), station: getStation(null), prevStation: 'MAG', nextStation: "POI", line: 'Line7', direction: DN, diverging: [] },
        { name: '53', LTEs: getLTEs('53', 'Line7'), station: getStation('53'), prevStation: '', nextStation: 'AKU', line: 'Line7', direction: DN, diverging: [] },
        { name: '51', LTEs: getLTEs('51', 'Line7'), station: getStation(null), prevStation: 'POI', nextStation: "AKU", line: 'Line7', direction: DN, diverging: [] },
        { name: '49', LTEs: getLTEs('49', 'Line7'), station: getStation('49'), prevStation: '', nextStation: 'KUR', line: 'Line7', direction: DN, diverging: [] },
        { name: '47', LTEs: getLTEs('47', 'Line7'), station: getStation(null), prevStation: 'AKU', nextStation: "KUR", line: 'Line7', direction: DN, diverging: [] },
        { name: '45', LTEs: getLTEs('45', 'Line7'), station: getStation('45'), prevStation: '', nextStation: 'DIN', line: 'Line7', direction: DN, diverging: [] },
        { name: '43', LTEs: getLTEs('43', 'Line7'), station: getStation(null), prevStation: 'KUR', nextStation: "DIN", line: 'Line7', direction: DN, diverging: [] },
        { name: '41', LTEs: getLTEs('41', 'Line7'), station: getStation('41'), prevStation: '', nextStation: 'AAR', line: 'Line7', direction: DN, diverging: [] },
        { name: '39', LTEs: getLTEs('39', 'Line7'), station: getStation(null), prevStation: 'DIN', nextStation: "AAR", line: 'Line7', direction: DN, diverging: [] },
        { name: '37', LTEs: getLTEs('37', 'Line7'), station: getStation(null), prevStation: 'DIN', nextStation: "AAR", line: 'Line7', direction: DN, diverging: [] },
        { name: '35', LTEs: getLTEs('35', 'Line7'), station: getStation(null), prevStation: 'DIN', nextStation: "AAR", line: 'Line7', direction: DN, diverging: getDiverging("35") },
        { name: '33', LTEs: getLTEs('33', 'Line7'), station: getStation('33'), prevStation: '', nextStation: 'GOE', line: 'Line7', direction: DN, diverging: [] },
        { name: '31', LTEs: getLTEs('31', 'Line7'), station: getStation(null), prevStation: 'AAR', nextStation: "GOE", line: 'Line7', direction: DN, diverging: getDiverging("31") },
        { name: '29', LTEs: getLTEs('29', 'Line7'), station: getStation(null), prevStation: 'AAR', nextStation: "GOE", line: 'Line7', direction: DN, diverging: [] },
        { name: '27', LTEs: getLTEs('27', 'Line7'), station: getStation(null), prevStation: 'AAR', nextStation: "GOE", line: 'Line7', direction: DN, diverging: [] },
        { name: '25', LTEs: getLTEs('25', 'Line7'), station: getStation('25'), prevStation: '', nextStation: 'JOE', line: 'Line7', direction: DN, diverging: [] },
        { name: '23', LTEs: getLTEs('23', 'Line7'), station: getStation(null), prevStation: 'GOE', nextStation: "JOE", line: 'Line7', direction: DN, diverging: [] },
        { name: '21', LTEs: getLTEs('21', 'Line7'), station: getStation('21'), prevStation: '', nextStation: 'MOG', line: 'Line7', direction: DN, diverging: [] },
        { name: '19', LTEs: getLTEs('19', 'Line7'), station: getStation(null), prevStation: 'JOE', nextStation: "MOG", line: 'Line7', direction: DN, diverging: [] },
        { name: '17', LTEs: getLTEs('17', 'Line7'), station: getStation('17'), prevStation: '', nextStation: 'GUN', line: 'Line7', direction: DN, diverging: [] },
        { name: '15', LTEs: getLTEs('15', 'Line7'), station: getStation(null), prevStation: 'MOG', nextStation: "GUN", line: 'Line7', direction: DN, diverging: [] },
        { name: '14', LTEs: getLTEs('14', 'Line7'), station: getStation(null), prevStation: 'MOG', nextStation: "GUN", line: 'Line7', direction: DN, diverging: [] },
        { name: '12', LTEs: getLTEs('12', 'Line7'), station: getStation(null), prevStation: 'MOG', nextStation: "GUN", line: 'Line7', direction: DN, diverging: getDiverging("12") },
        { name: '10', LTEs: getLTEs('10', 'Line7'), station: getStation(null), prevStation: 'MOG', nextStation: "GUN", line: 'Line7', direction: DN, diverging: [] },
        { name: '8', LTEs: getLTEs('8', 'Line7'), station: getStation('8'), prevStation: '', nextStation: 'GUN', line: 'Line7', direction: DN, diverging: [] },
        { name: '6', LTEs: getLTEs('6', 'Line7'), station: getStation(null), prevStation: 'GUN', nextStation: "", line: 'Line7', direction: DN, diverging: [] },
        { name: '4', LTEs: getLTEs('4', 'Line7'), station: getStation(null), prevStation: 'GUN', nextStation: "", line: 'Line7', direction: DN, diverging: getDiverging("4") },
        { name: '2', LTEs: getLTEs('2', 'Line7'), station: getStation(null), prevStation: 'GUN', nextStation: "", line: 'Line7', direction: DN, diverging: [] },

        /////////////////////////////////////////////////////////////LINE 2 down///////////////////////////////////////////////////////////////////


        { name: '2AT4401', LTEs: getLTEs('2AT4401', 'Line2'), station: getStation(null), prevStation: '', nextStation: 'DAE', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4403', LTEs: getLTEs('2AT4403', 'Line2'), station: getStation(null), prevStation: '', nextStation: 'DAE', line: 'Line2', direction: UP, diverging: getDiverging("2AT4403") },
        { name: '2AT4405', LTEs: getLTEs('2AT4405', 'Line2'), station: getStation("2AT4405"), prevStation: '', nextStation: 'UPD', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4407', LTEs: getLTEs('2AT4407', 'Line2'), station: getStation(null), prevStation: 'DAE', nextStation: 'UPD', line: 'Line2', direction: UP, diverging: getDiverging("2AT4407") },
        { name: '2AT4409', LTEs: getLTEs('2AT4409', 'Line2'), station: getStation(null), prevStation: 'DAE', nextStation: 'UPD', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4411', LTEs: getLTEs('2AT4411', 'Line2'), station: getStation(null), prevStation: 'DAE', nextStation: 'UPD', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4501', LTEs: getLTEs('2AT4501', 'Line2'), station: getStation("2AT4501"), prevStation: '', nextStation: 'KAN', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4503', LTEs: getLTEs('2AT4503', 'Line2'), station: getStation(null), prevStation: 'UPD', nextStation: 'KAN', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4601', LTEs: getLTEs('2AT4601', 'Line2'), station: getStation("2AT4601"), prevStation: '', nextStation: 'MAN', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4603', LTEs: getLTEs('2AT4603', 'Line2'), station: getStation(null), prevStation: 'KAN', nextStation: 'MAN', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4701', LTEs: getLTEs('2AT4701', 'Line2'), station: getStation('2AT4701'), prevStation: '', nextStation: 'EKS', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4703', LTEs: getLTEs('2AT4703', 'Line2'), station: getStation(null), prevStation: 'MAN', nextStation: 'EKS', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4801', LTEs: getLTEs('2AT4801', 'Line2'), station: getStation("2AT4801"), prevStation: '', nextStation: 'BOW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4803', LTEs: getLTEs('2AT4803', 'Line2'), station: getStation(null), prevStation: 'EKS', nextStation: 'BOW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4901', LTEs: getLTEs('2AT4901', 'Line2'), station: getStation('2AT4901'), prevStation: '', nextStation: 'PAE', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT4903', LTEs: getLTEs('2AT4903', 'Line2'), station: getStation(null), prevStation: 'BOW', nextStation: 'PAE', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5001', LTEs: getLTEs('2AT5001', 'Line2'), station: getStation("2AT5001"), prevStation: '', nextStation: 'KAW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5003', LTEs: getLTEs('2AT5003', 'Line2'), station: getStation(null), prevStation: 'PAE', nextStation: 'KAW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5101', LTEs: getLTEs('2AT5101', 'Line2'), station: getStation('2AT5101'), prevStation: '', nextStation: 'DAH', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5103', LTEs: getLTEs('2AT5103', 'Line2'), station: getStation(null), prevStation: 'KAW', nextStation: 'DAH', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5201', LTEs: getLTEs('2AT5201', 'Line2'), station: getStation(null), prevStation: 'KAW', nextStation: 'DAH', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5203', LTEs: getLTEs('2AT5203', 'Line2'), station: getStation(null), prevStation: 'KAW', nextStation: 'DAH', line: 'Line2', direction: UP, diverging: getDiverging("2AT5203") },
        { name: '2AT5205', LTEs: getLTEs('2AT5205', 'Line2'), station: getStation(null), prevStation: 'KAW', nextStation: 'DAH', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5207', LTEs: getLTEs('2AT5207', 'Line2'), station: getStation("2AT5207"), prevStation: '', nextStation: 'VAL', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5209', LTEs: getLTEs('2AT5209', 'Line2'), station: getStation(null), prevStation: 'DAH', nextStation: 'VAL', line: 'Line2', direction: UP, diverging: getDiverging("2AT5209") },
        { name: '2AT5211', LTEs: getLTEs('2AT5211', 'Line2'), station: getStation(null), prevStation: 'DAH', nextStation: 'VAL', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5213', LTEs: getLTEs('2AT5213', 'Line2'), station: getStation(null), prevStation: 'DAH', nextStation: 'VAL', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5301', LTEs: getLTEs('2AT5301', 'Line2'), station: getStation("2AT5301"), prevStation: '', nextStation: 'MAW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5303', LTEs: getLTEs('2AT5303', 'Line2'), station: getStation(null), prevStation: 'VAL', nextStation: 'MAW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5401', LTEs: getLTEs('2AT5401', 'Line2'), station: getStation('2AT5401'), prevStation: '', nextStation: '', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5403', LTEs: getLTEs('2AT5403', 'Line2'), station: getStation(null), prevStation: 'MAW', nextStation: 'LOM', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5501', LTEs: getLTEs('2AT5501', 'Line2'), station: getStation("2AT5501"), prevStation: '', nextStation: 'PAG', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5503', LTEs: getLTEs('2AT5503', 'Line2'), station: getStation(null), prevStation: 'LOM', nextStation: 'PAG', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5601', LTEs: getLTEs('2AT5601', 'Line2'), station: getStation("2AT5601"), prevStation: '', nextStation: 'GOW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5603', LTEs: getLTEs('2AT5603', 'Line2'), station: getStation(null), prevStation: 'PAG', nextStation: 'GOW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5701', LTEs: getLTEs('2AT5701', 'Line2'), station: getStation("2AT5701"), prevStation: '', nextStation: 'OSH', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5703', LTEs: getLTEs('2AT5703', 'Line2'), station: getStation(null), prevStation: 'GOW', nextStation: 'OSH', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5801', LTEs: getLTEs('2AT5801', 'Line2'), station: getStation("2AT5801"), prevStation: '', nextStation: 'LOO', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5803', LTEs: getLTEs('2AT5803', 'Line2'), station: getStation(null), prevStation: 'GOW', nextStation: 'LOO', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5901', LTEs: getLTEs('2AT5901', 'Line2'), station: getStation("2AT5901"), prevStation: '', nextStation: 'ANW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT5903', LTEs: getLTEs('2AT5903', 'Line2'), station: getStation(null), prevStation: 'LOO', nextStation: 'ANW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT6001', LTEs: getLTEs('2AT6001', 'Line2'), station: getStation(null), prevStation: 'LOO', nextStation: 'ANW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT6003', LTEs: getLTEs('2AT6003', 'Line2'), station: getStation(null), prevStation: 'LOO', nextStation: 'ANW', line: 'Line2', direction: UP, diverging: getDiverging("2AT6003") },
        { name: '2AT6005', LTEs: getLTEs('2AT6005', 'Line2'), station: getStation(null), prevStation: 'LOO', nextStation: 'ANW', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT6007', LTEs: getLTEs('2AT6007', 'Line2'), station: getStation("2AT6007"), prevStation: '', nextStation: '', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT6009', LTEs: getLTEs('2AT6009', 'Line2'), station: getStation(null), prevStation: '', nextStation: '', line: 'Line2', direction: UP, diverging: [] },
        { name: '2AT6011', LTEs: getLTEs('2AT6011', 'Line2'), station: getStation(null), prevStation: '', nextStation: '', line: 'Line2', direction: UP, diverging: getDiverging("2AT6011") },
        { name: '2AT6013', LTEs: getLTEs('2AT6013', 'Line2'), station: getStation(null), prevStation: '', nextStation: '', line: 'Line2', direction: UP, diverging: [] },

        /////////////////////////////////////////////////////////////LINE 2 up///////////////////////////////////////////////////////////////////
        { name: '2AT6014', LTEs: getLTEs('2AT6014', 'Line2'), station: getStation(null), prevStation: '', nextStation: 'ANW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT6012', LTEs: getLTEs('2AT6012', 'Line2'), station: getStation(null), prevStation: '', nextStation: 'ANW', line: 'Line2', direction: DN, diverging: getDiverging("2AT6012") },
        { name: '2AT6010', LTEs: getLTEs('2AT6010', 'Line2'), station: getStation(null), prevStation: '', nextStation: 'ANW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT6008', LTEs: getLTEs('2AT6008', 'Line2'), station: getStation("2AT6008"), prevStation: '', nextStation: 'LOO', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT6006', LTEs: getLTEs('2AT6006', 'Line2'), station: getStation(null), prevStation: 'ANW', nextStation: 'LOO', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT6004', LTEs: getLTEs('2AT6004', 'Line2'), station: getStation(null), prevStation: 'ANW', nextStation: 'LOO', line: 'Line2', direction: DN, diverging: getDiverging("2AT6004") },
        { name: '2AT6002', LTEs: getLTEs('2AT6002', 'Line2'), station: getStation(null), prevStation: 'ANW', nextStation: 'LOO', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5904', LTEs: getLTEs('2AT5904', 'Line2'), station: getStation(null), prevStation: 'ANW', nextStation: 'LOO', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5902', LTEs: getLTEs('2AT5902', 'Line2'), station: getStation("2AT5902"), prevStation: '', nextStation: 'OSH', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5804', LTEs: getLTEs('2AT5804', 'Line2'), station: getStation(null), prevStation: 'LOO', nextStation: 'OSH', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5802', LTEs: getLTEs('2AT5802', 'Line2'), station: getStation("2AT5802"), prevStation: '', nextStation: 'GOW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5704', LTEs: getLTEs('2AT5704', 'Line2'), station: getStation(null), prevStation: 'OSH', nextStation: 'GOW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5702', LTEs: getLTEs('2AT5702', 'Line2'), station: getStation("2AT5702"), prevStation: '', nextStation: 'PAG', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5604', LTEs: getLTEs('2AT5604', 'Line2'), station: getStation(null), prevStation: 'GOW', nextStation: 'PAG', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5602', LTEs: getLTEs('2AT5602', 'Line2'), station: getStation("2AT5602"), prevStation: '', nextStation: 'LOM', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5504', LTEs: getLTEs('2AT5504', 'Line2'), station: getStation(null), prevStation: 'PAG', nextStation: 'LOM', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5502', LTEs: getLTEs('2AT5502', 'Line2'), station: getStation("2AT5502"), prevStation: '', nextStation: 'MAW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5404', LTEs: getLTEs('2AT5404', 'Line2'), station: getStation(null), prevStation: 'LOM', nextStation: 'MAW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5402', LTEs: getLTEs('2AT5402', 'Line2'), station: getStation('2AT5402'), prevStation: '', nextStation: 'VAL', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5304', LTEs: getLTEs('2AT5304', 'Line2'), station: getStation(null), prevStation: 'MAW', nextStation: 'VAL', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5302', LTEs: getLTEs('2AT5302', 'Line2'), station: getStation("2AT5302"), prevStation: '', nextStation: 'DAH', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5218', LTEs: getLTEs('2AT5218', 'Line2'), station: getStation(null), prevStation: 'VAL', nextStation: 'DAH', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5216', LTEs: getLTEs('2AT5216', 'Line2'), station: getStation(null), prevStation: 'VAL', nextStation: 'DAH', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5214', LTEs: getLTEs('2AT5214', 'Line2'), station: getStation(null), prevStation: 'VAL', nextStation: 'DAH', line: 'Line2', direction: DN, diverging: getDiverging("2AT5214") },
        { name: '2AT5212', LTEs: getLTEs('2AT5212', 'Line2'), station: getStation(null), prevStation: 'VAL', nextStation: 'DAH', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5210', LTEs: getLTEs('2AT5210', 'Line2'), station: getStation(null), prevStation: 'VAL', nextStation: 'DAH', line: 'Line2', direction: DN, diverging: getDiverging("2AT5210") },
        { name: '2AT5208', LTEs: getLTEs('2AT5208', 'Line2'), station: getStation(null), prevStation: 'VAL', nextStation: 'DAH', line: 'Line2', direction: DN, diverging: getDiverging("2AT5208") },
        { name: '2AT5206', LTEs: getLTEs('2AT5206', 'Line2'), station: getStation("2AT5206"), prevStation: '', nextStation: 'KAW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5204', LTEs: getLTEs('2AT5204', 'Line2'), station: getStation(null), prevStation: 'DAH', nextStation: 'KAW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5202', LTEs: getLTEs('2AT5202', 'Line2'), station: getStation(null), prevStation: 'DAH', nextStation: 'KAW', line: 'Line2', direction: DN, diverging: getDiverging("2AT5202") },
        { name: '2AT5104', LTEs: getLTEs('2AT5104', 'Line2'), station: getStation(null), prevStation: 'DAH', nextStation: 'KAW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5102', LTEs: getLTEs('2AT5102', 'Line2'), station: getStation("2AT5102"), prevStation: '', nextStation: 'PAE', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5004', LTEs: getLTEs('2AT5004', 'Line2'), station: getStation(null), prevStation: 'KAW', nextStation: 'PAE', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT5002', LTEs: getLTEs('2AT5002', 'Line2'), station: getStation("2AT5002"), prevStation: '', nextStation: 'BOW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4904', LTEs: getLTEs('2AT4904', 'Line2'), station: getStation(null), prevStation: 'PAE', nextStation: 'BOW', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4902', LTEs: getLTEs('2AT4902', 'Line2'), station: getStation("2AT4902"), prevStation: '', nextStation: 'EKS', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4804', LTEs: getLTEs('2AT4804', 'Line2'), station: getStation(null), prevStation: 'BOW', nextStation: 'EKS', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4802', LTEs: getLTEs('2AT4802', 'Line2'), station: getStation("2AT4802"), prevStation: '', nextStation: 'MAN', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4704', LTEs: getLTEs('2AT4704', 'Line2'), station: getStation(null), prevStation: 'EKS', nextStation: 'MAN', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4702', LTEs: getLTEs('2AT4702', 'Line2'), station: getStation("2AT4702"), prevStation: '', nextStation: 'KAN', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4604', LTEs: getLTEs('2AT4604', 'Line2'), station: getStation(null), prevStation: 'MAN', nextStation: 'KAN', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4602', LTEs: getLTEs('2AT4602', 'Line2'), station: getStation("2AT4602"), prevStation: '', nextStation: 'UPD', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4504', LTEs: getLTEs('2AT4504', 'Line2'), station: getStation(null), prevStation: 'KAN', nextStation: 'UPD', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4502', LTEs: getLTEs('2AT4502', 'Line2'), station: getStation("2AT4502"), prevStation: '', nextStation: 'DAE', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4412', LTEs: getLTEs('2AT4412', 'Line2'), station: getStation(null), prevStation: 'UPD', nextStation: 'DAE', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4410', LTEs: getLTEs('2AT4410', 'Line2'), station: getStation(null), prevStation: 'UPD', nextStation: 'DAE', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4408', LTEs: getLTEs('2AT4408', 'Line2'), station: getStation(null), prevStation: 'UPD', nextStation: 'DAE', line: 'Line2', direction: DN, diverging: getDiverging("2AT4408") },
        { name: '2AT4406', LTEs: getLTEs('2AT4406', 'Line2'), station: getStation('2AT4406'), prevStation: '', nextStation: '', line: 'Line2', direction: DN, diverging: [] },
        { name: '2AT4404', LTEs: getLTEs('2AT4404', 'Line2'), station: getStation(null), prevStation: '', nextStation: '', line: 'Line2', direction: DN, diverging: getDiverging("2AT4404") },
        { name: '2AT4402', LTEs: getLTEs('2AT4402', 'Line2'), station: getStation(null), prevStation: '', nextStation: '', line: 'Line2', direction: DN, diverging: [] },
    ],
    trains,
    stationRadios
]
const aquaLineLTE = [], orangeLineLTEs = []

module.exports = { aquaLineLTE, orangeLineLTE, trackCircuits, trains, stationRadios, aquaDepotLTE, orangeLineLTEs, orangeDepotLTE };