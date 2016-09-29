'use strict';
import $ from 'jquery'

let CalUtils = {
	// 当前日历显示的年份
	showYear : 2016,
	// 当前日历显示的月份
	showMonth : 9,
	// 初始化日历
	init : function(calendar) {
		CalUtils.setMonthAndDay(calendar.today);
		return CalUtils.draw(calendar.signList, calendar.signImg);
	},
	// 获取当前选择的年月
	setMonthAndDay : function(today) {
		if (today) {
			var date = CalUtils.toDate(today);
			CalUtils.showYear = date.getFullYear();
			CalUtils.showMonth = date.getMonth() + 1;
		}
	},
	draw : function(signList, signImg) {
		// 绑定日历
		var str = CalUtils.drawCal(CalUtils.showYear, CalUtils.showMonth,
				signList, signImg);
		return str;
	},
	getDaysInmonth : function(iMonth, iYear) {
		var dPrevDate = new Date(iYear, iMonth, 0);
		return dPrevDate.getDate();
	},
	// 获取当前月的周数（日历行数）
	getWeeks : function(y, m) {
		var today = new Date();
		var last = new Date(today.getFullYear(), today.getMonth() + 1, 0);// 获取当前月最后一天时间

		var date = new Date(y, m, 0);
		var sn = 0;
		for (var i = 0; i < date.getDate(); i++) {
			today.setFullYear(y, m - 1, i + 1);
			var day = today.getDay();
			if (day == 0) {
				sn++;
			}
		}
		if (last.getDate() != 0) {
			sn++;
		}

		return sn;
	},
	// 字符串转date
	toDate : function(date) {
		date = date.replace('年', '-');
		date = date.replace('月', '-');
		date = date.replace('日', '');
		return new Date(date.replace(/-/g, "/").substring(0, 10));
	},
	bulidCal : function(iYear, iMonth) {
		// 获取当前月的周数（日历行数）
		var ws = CalUtils.getWeeks(iYear, iMonth);
		var aMonth = new Array();
		aMonth[0] = new Array(7);
		aMonth[1] = new Array(7);
		aMonth[2] = new Array(7);
		aMonth[3] = new Array(7);
		aMonth[4] = new Array(7);
		aMonth[5] = new Array(7);
		if (ws >= 6){
			aMonth[6] = new Array(7);
		}
		// 获取第一天 （new Date(y,m,f)：  f=1获取第一天，f=0获取最后一天，f=n本月第n天，超出本月最大天数日期为下月）
		var dCalDate = new Date(iYear, iMonth - 1, 1);
		// 获取第一天为星期几
		var iDayOfFirst = dCalDate.getDay();
		// 获取当月总天数
		var iDaysInMonth = CalUtils.getDaysInmonth(iMonth, iYear);
		var iVarDate = 1;
		var d, w;
		aMonth[0][0] = "日";
		aMonth[0][1] = "一";
		aMonth[0][2] = "二";
		aMonth[0][3] = "三";
		aMonth[0][4] = "四";
		aMonth[0][5] = "五";
		aMonth[0][6] = "六";
		for (d = iDayOfFirst; d < 7; d++) {
			aMonth[1][d] = iVarDate;
			iVarDate++;
		}
		for (w = 2; w < ws + 1; w++) {
			for (d = 0; d < 7; d++) {
				if (iVarDate <= iDaysInMonth) {
					aMonth[w][d] = iVarDate;
					iVarDate++;
				}
			}
		}
		return aMonth;
	},
	ifHasSigned : function(signList, day) {
		var signs = signList.split(",");
		var signed = false;
		$.each(signs, function(index, item) {
			if (item == day) {
				signed = true;
				return false;
			}
		});
		return signed;
	},
	drawCal : function(iYear, iMonth, signList, signImg) {
		var myMonth = CalUtils.bulidCal(iYear, iMonth);
		var htmls = new Array();
		htmls.push("<div class='sign_main' id='sign_layer'>");
		htmls.push("<div class='sign_succ_calendar_title'>");
		htmls.push("<div class='calendar_month_span'>"+iYear+"年"+iMonth+"月"+"</div>");
		htmls.push("</div>");
		htmls.push("<div class='sign' id='sign_cal'>");
		htmls.push("<table>");
		htmls.push("<thead>");
		htmls.push("<tr>");
		htmls.push("<th>" + myMonth[0][0] + "</th>");
		htmls.push("<th>" + myMonth[0][1] + "</th>");
		htmls.push("<th>" + myMonth[0][2] + "</th>");
		htmls.push("<th>" + myMonth[0][3] + "</th>");
		htmls.push("<th>" + myMonth[0][4] + "</th>");
		htmls.push("<th>" + myMonth[0][5] + "</th>");
		htmls.push("<th>" + myMonth[0][6] + "</th>");
		htmls.push("</tr>");
		htmls.push("</thead>");
		var d, w;
		var ws = CalUtils.getWeeks(iYear, iMonth);
		for (w = 1; w < ws + 1; w++) {
			htmls.push("<tr>");
			for (d = 0; d < 7; d++) {
				var ifHasSigned = CalUtils.ifHasSigned(signList, myMonth[w][d]);
				if (ifHasSigned) {
					htmls.push("<td class='on'><img src='" + signImg
							+ "'/></td>");
				} else {
					// isNaN(s): 检查其参数是否是非数字值
					htmls.push("<td>"+ (!isNaN(myMonth[w][d]) ? myMonth[w][d]: "&nbsp;") + "</td>");
				}
			}
			htmls.push("</tr>");
		}
		htmls.push("</table>");
		htmls.push("</div>");
		htmls.push("</div>");
		return htmls.join('');
	}
};
module.exports = CalUtils;
