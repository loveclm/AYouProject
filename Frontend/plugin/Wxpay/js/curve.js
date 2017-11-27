var ctx;
var origin_cnt = 8;
var cur_cnt = 0;
var dw = 9;
var startx = 35;
var endx = 54;
var dr = 0;
var pointList = [[385,137],
    [435,353],
    [381,572],
    [272,777],
    [233,994 ],
    [323,1210],
    [486,1477],
    [576,1693],
    [537,1910],
    [428,2115],
    [374,2334],
    [424,2550],
    [582,2816],
    [398,2987],
    [226,3184],
    [300,3414],
    [420,3614],
    [460,3844]];
var origin_width = 750;
var origin_height = 4002;
var dr = 76;
var mPoints = [];

$(function(){
    var c = document.getElementById("course_canvas");

    ctx = c.getContext("2d");
});

function generatePoints(n){
    // var width = document.body.clientWidth
    //     || document.documentElement.clientWidth
    //     || window.innerWidth;
    //
    // var height = document.body.clientHeight
    //     || document.documentElement.clientHeight
    //     || window.innerHeight;
    var width = parseFloat($('#home_img').css('width'));
    var height = parseFloat(width) * origin_height/origin_width;//parseFloat($('#home_img').css('height'));

    dr = dr*width/origin_width;

    mPoints = [];
    for(var i = 0; i < n; i++){
        mPoints.push(width*pointList[i][0]/origin_width, height*pointList[i][1]/origin_height);
    }

    return;

    cur_cnt = ( n > 8 ) ? n : origin_cnt;

    dr = dw * width/100 * 7/cur_cnt;

    mPoints = [];
    mPoints.push(width*startx/100, 0);

    n = 0;
    for(var i = 0; i < 6.28; i+= 6.28/cur_cnt){
        x = Math.sin(i+0.4*8/cur_cnt) * width/8 + width*(startx + dw)/100;
        y = (i+0.8*8/cur_cnt)*height/7;

        mPoints.push(x, y);

        n++;
        if( n == cur_cnt) break;
    }
    mPoints.push(width*endx/100, height);
    //console.log(mPoints);
    drawCurve(ctx, mPoints);
    for( n = 1; n <= cur_cnt; n++){
        x = mPoints[2*n];
        y = mPoints[2*n+1];

        ctx.beginPath();
        ctx.arc(x, y, dr, 0, 2 * Math.PI);
        ctx.fillStyle = '#b3f0e8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3*8/cur_cnt;
        ctx.stroke();
    }
}



function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

    ctx.beginPath();

    drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

    if (showPoints) {
        ctx.beginPath();
        for(var i=0;i<ptsa.length-1;i+=2)
            ctx.rect(ptsa[i] - 2, ptsa[i+1] - 2, 4, 4);
    }
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5*8/cur_cnt;
    ctx.stroke();
}

function getCurvePoints(pts, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [],	// clone array
        x, y,			// our x,y coords
        t1x, t2x, t1y, t2y,	// tension vectors
        c1, c2, c3, c4,		// cardinal points
        st, t, i;		// steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    }
    else {
        _pts.unshift(pts[1]);	//copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]);	//copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;

            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3) 	- 3 * Math.pow(st, 2) + 1;
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
            c3 = 	   Math.pow(st, 3)	- 2 * Math.pow(st, 2) + st;
            c4 = 	   Math.pow(st, 3)	- 	  Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i]	+ c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]	+ c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }

    return res;
}

function drawLines(ctx, pts) {
    ctx.moveTo(pts[0], pts[1]);
    for(var i=2;i<pts.length-1;i+=2)
        ctx.lineTo(pts[i], pts[i+1]);
}
