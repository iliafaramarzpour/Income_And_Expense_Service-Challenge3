var IncomeRadioButton = document.querySelector("#income-button");
var CostRadioButton = document.querySelector("#cost-button");
var AmountValue = document.querySelector("#amount-value");
var AmountValueText = document.querySelector("#amount-value-text");
var DateDayValue = document.querySelector("#date-day-value");
var DateMonthValue = document.querySelector("#date-month-value");
var DateYearValue = document.querySelector("#date-year-value");
var DescriptionValue = document.querySelector("#description-value");
var RecordInfo = document.querySelector("#record-info");
var IncomeText = document.querySelector("#income-text");
var ExpendituresText = document.querySelector("#expenditures-text");
var TableMain = document.querySelector("#table-main");
var DescriptionContent = document.querySelector("#description-content");
var ImportData = document.querySelector("#import-data");
var ImportDataValue = document.querySelector("#import-data-value");
var ExportData = document.querySelector("#export-data");
var ExportDataValue = document.querySelector("#export-data-value");
var BackExportModal = document.querySelector("#back-export-modal");
var RemoveModalBtn = document.querySelector(".modal-delete-item-btn");
var MainChart = document.querySelector("#main-chart");
var TotalIncome = "";
var TotalCost = "";
var TableType = "";
var TableTemplate = "";
var TableInfoObject = [];
var ItemsIdNumber = 1;
var ChartDetails = {
  chart: {
    type: "line",
  },
  series: [
    {
      name: "درآمد",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "هزینه",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
  xaxis: {
    tooltip: {
      enabled: true,
      colors: ["#2cbe26", "#E03F3F"],
    },
    seriesName: undefined,
    categories: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
  },
  legend: {
    show: false,
  },
  stroke: {
    colors: ["#2cbe26", "#E03F3F"],
  },
};
var chart = new ApexCharts(MainChart, ChartDetails);

///Functions
function CreateRecordTable() {
  if (
    AmountValue.value === "" ||
    DateDayValue.value === "" ||
    DateMonthValue.value === "" ||
    DateYearValue.value === "" ||
    DescriptionValue.value === "" ||
    Number.isNaN(Number(AmountValue.value)) ||
    Number.isNaN(Number(DateDayValue.value)) ||
    Number.isNaN(Number(DateMonthValue.value)) ||
    Number.isNaN(Number(DateYearValue.value)) ||
    DateDayValue.value.length > 2 ||
    DateMonthValue.value.length > 2 ||
    DateYearValue.value.length > 4 ||
    Number(DateDayValue.value) > 31 ||
    Number(DateMonthValue.value) > 12
  ) {
    iziToast.error({
      title: "خطا",
      message: "لطفا مقادیر را به درستی و کامل وارد کنید!",
      rtl: true,
      position: "bottomRight",
    });
    ClearGetInfoTable();
  } else if (IncomeRadioButton.checked) {
    CreateTableInfo(
      ItemsIdNumber,
      "income",
      AmountValue.value,
      DateDayValue.value,
      DateMonthValue.value,
      DateYearValue.value,
      DescriptionValue.value
    );
    AddDataToChart("income", DateMonthValue.value, AmountValue.value);
    ComputingTotalIncomeAndCost("income", AmountValue.value);
    ClearGetInfoTable();
  } else if (CostRadioButton.checked) {
    CreateTableInfo(
      ItemsIdNumber,
      "cost",
      AmountValue.value,
      DateDayValue.value,
      DateMonthValue.value,
      DateYearValue.value,
      DescriptionValue.value
    );
    AddDataToChart("cost", DateMonthValue.value, AmountValue.value);
    ComputingTotalIncomeAndCost("cost", AmountValue.value);
    ClearGetInfoTable();
  }
}

function ClearGetInfoTable() {
  AmountValue.value = "";
  DateDayValue.value = "";
  DateMonthValue.value = "";
  DateYearValue.value = "";
  DescriptionValue.value = "";
  AmountValueText.textContent = "";
}

function RealTimeTypeAmount() {
  if (Number.isNaN(Number(AmountValue.value))) {
    ClearGetInfoTable();
    iziToast.error({
      title: "خطا",
      message: "ورودی را به صورت عدد وارد کنید!",
      rtl: true,
      position: "bottomRight",
    });
  } else if (AmountValue.value.length > 60) {
    ClearGetInfoTable();
    iziToast.error({
      title: "خطا",
      message: "ورودی اعداد نباید بیشتر از ۶۰ عدد باشد",
      rtl: true,
      position: "bottomRight",
    });
  } else {
    AmountValueText.textContent = Num2persian(Number(AmountValue.value));
  }
}

function CreateTableInfo(
  id,
  TableType,
  Amount,
  DayInDate,
  MonthInDate,
  YearInDate,
  Description
) {
  TableInfoObject.push({
    id: id,
    type: TableType,
    Amount: Amount,
    DayInDate: DayInDate,
    MonthInDate: MonthInDate,
    YearInDate: YearInDate,
    Description: Description,
  });
  SaveToLocalStorage("TableInfo", TableInfoObject);
  CreateTableDivision(TableInfoObject);
}

function SaveToLocalStorage(ValuesName, Value) {
  localStorage.setItem(ValuesName, JSON.stringify(Value));
}

function CreateTableDivision(Item) {
  ItemsIdNumber = ItemsIdNumber + 1;
  localStorage.setItem("Last-Item-Id", ItemsIdNumber);
  ItemsIdNumber = Number(localStorage.getItem("Last-Item-Id"));
  var InfoListItem = Item.length;
  if (Item[InfoListItem - 1].type === "income") {
    TableType = "درآمد";
  } else {
    TableType = "هزینه";
  }
  TableTemplate += `
    <div class="table__row">
        <span class="table__number">
            ${Item[InfoListItem - 1].id}
        </span>
        <div class="table__amount">
            <span>${Item[InfoListItem - 1].Amount}</span>
            تومان
        </div>
        <div class="table__date">
            ${Item[InfoListItem - 1].YearInDate}/${
    Item[InfoListItem - 1].MonthInDate
  }/${Item[InfoListItem - 1].DayInDate}
        </div>
        <div class="table__type ${Item[InfoListItem - 1].type}">
            ${TableType}
        </div>
        <div class="table__description__button">
            <button data-toggle="modal" data-target="#description-modal" onclick="ShowDetailsItem(${
              Item[InfoListItem - 1].id
            })">نمایش</button>
            <button data-toggle="modal" data-target="#delete-modal" onclick="RemoveItems(${
              Item[InfoListItem - 1].id
            })">حذف</button>
        </div>
    </div>
  `;
  TableMain.innerHTML = TableTemplate;
}

function CreateTableWithLocalStorage() {
  var TableItemsArr = JSON.parse(localStorage.getItem("TableInfo"));
  if (TableItemsArr === null) {
  } else {
    TableInfoObject = TableItemsArr;
    ItemsIdNumber = TableItemsArr.length + 1;
    localStorage.setItem("Last-Item-Id", ItemsIdNumber);
    TableItemsArr.forEach(function (Item) {
      if (Item.type === "income") {
        TableType = "درآمد";
      } else {
        TableType = "هزینه";
      }
      TableTemplate += `
        <div class="table__row">
            <span class="table__number">
                ${TableItemsArr.indexOf(Item) + 1}                
            </span>
            <div class="table__amount">
                <span>${Item.Amount}</span>
                تومان
            </div>
            <div class="table__date">
                ${Item.YearInDate}/${Item.MonthInDate}/${Item.DayInDate}
            </div>
            <div class="table__type ${Item.type}">
                ${TableType}
            </div>
            <div class="table__description__button">
                <button data-toggle="modal" data-target="#description-modal" onclick="ShowDetailsItem(${
                  Item.id
                })">نمایش</button>
                <button data-toggle="modal" data-target="#delete-modal" onclick="RemoveItems(${
                  Item.id
                })">حذف</button>
            </div>
        </div>
        `;
      TableMain.innerHTML = TableTemplate;
    });
  }
}

function ShowDetailsItem(ItemNum) {
  var Items = JSON.parse(localStorage.getItem("TableInfo"));
  Items.forEach(function (item) {
    if (item.id === ItemNum) {
      DescriptionContent.textContent = item.Description;
    }
  });
}

function RemoveItems(ItemNum) {
  RemoveModalBtn.onclick = function () {
    var TypeTable = TableMain.children[ItemNum - 1].childNodes[7].innerText;
    if (TypeTable === "درآمد") {
      var Item =
        TableMain.children[ItemNum - 1].children[1].children[0].textContent;
      TotalIncome = Number(TotalIncome) - Number(Item);
      IncomeText.textContent = [Number(TotalIncome)].toLocaleString();
    } else if (TypeTable === "هزینه") {
      var Item =
        TableMain.children[ItemNum - 1].children[1].children[0].textContent;
      TotalCost = Number(TotalCost) - Number(Item);
      ExpendituresText.textContent = [Number(TotalCost)].toLocaleString();
    }
    var AmountItemValue = Number(
      TableMain.children[ItemNum - 1].childNodes[3].childNodes[1].innerText
    );
    if (TypeTable === "درآمد") {
      var DateValue = TableMain.children[
        ItemNum - 1
      ].childNodes[5].innerText.split("/")[1];
      ChartDetails.series[0].data[DateValue - 1] -= AmountItemValue;
      localStorage.setItem(
        "IncomeListChart",
        JSON.stringify(ChartDetails.series[0].data)
      );
    } else {
      var DateValue = TableMain.children[
        ItemNum - 1
      ].childNodes[5].innerText.split("/")[1];
      ChartDetails.series[1].data[DateValue - 1] -= AmountItemValue;
      localStorage.setItem(
        "IncomeListChart",
        JSON.stringify(ChartDetails.series[1].data)
      );
    }
    UpdateChart();
    var Result = JSON.parse(localStorage.getItem("TableInfo"));
    Result.forEach(function (item, index) {
      if (item.id === ItemNum) {
        Result.splice(index, 1);
      }
    });
    localStorage.setItem("TableInfo", JSON.stringify(Result));
    localStorage.setItem("Last-Item-Id", ItemsIdNumber - 1);
    var TableItems = document.querySelectorAll(".table__row");
    TableItems[0].remove();
    if (Result.length === 0) {
      ItemsIdNumber = 1;
      localStorage.setItem("Last-Item-Id", ItemsIdNumber);
    }
    TableTemplate = "";
    Result.forEach(function (Item) {
      if (Item.type === "income") {
        TableType = "درآمد";
      } else {
        TableType = "هزینه";
      }
      Item.id = Result.indexOf(Item) + 1;
      TableTemplate += `
        <div class="table__row">
            <span class="table__number">
                ${Result.indexOf(Item) + 1}                
            </span>
            <div class="table__amount">
                <span>${Item.Amount}</span>
                تومان
            </div>
            <div class="table__date">
                ${Item.YearInDate}/${Item.MonthInDate}/${Item.DayInDate}
            </div>
            <div class="table__type ${Item.type}">
                ${TableType}
            </div>
            <div class="table__description__button">
                <button data-toggle="modal" data-target="#description-modal" onclick="ShowDetailsItem(${
                  Item.id
                })">نمایش</button>
                <button data-toggle="modal" data-target="#delete-modal" onclick="RemoveItems(${
                  Item.id
                })">حذف</button>
            </div>
        </div>
        `;
      TableMain.innerHTML = TableTemplate;
      localStorage.setItem("TableInfo", JSON.stringify(Result));
    });
  };
}

function ComputingTotalIncomeAndCost(Type, Amount) {
  if (Type === "income") {
    if (Number.isNaN(Number(Amount))) {
    } else {
      TotalIncome = Number(TotalIncome) + Number(Amount);
      IncomeText.textContent = [Number(TotalIncome)].toLocaleString();
    }
  } else {
    if (Number.isNaN(Number(Amount))) {
    } else {
      TotalCost = Number(TotalCost) + Number(Amount);
      ExpendituresText.textContent = [Number(TotalCost)].toLocaleString();
    }
  }
}

function GetTotalIncomAndCostFromLocalSotrage() {
  var TotalItems = JSON.parse(localStorage.getItem("TableInfo"));
  if (TotalItems === null) {
  } else {
    TotalItems.forEach(function (Item) {
      if (Item.type === "income") {
        if (TotalIncome === "") {
          TotalIncome = Number(Item.Amount);
        } else {
          TotalIncome = Number(TotalIncome) + Number(Item.Amount);
        }
      } else {
        if (TotalCost === "") {
          TotalCost = Number(Item.Amount);
        } else {
          TotalCost = Number(TotalCost) + Number(Item.Amount);
        }
      }
    });
    IncomeText.textContent = [Number(TotalIncome)].toLocaleString();
    ExpendituresText.textContent = [Number(TotalCost)].toLocaleString();
  }
}

function ExportTableData() {
  var ExportResult = localStorage.getItem("TableInfo");
  ExportDataValue.value = ExportResult;
  if (localStorage.getItem("TableInfo") === null) {
    iziToast.warning({
      title: "هشدار",
      message:
        "مقداری برای خروجی گرفتن وجود ندارد ، پس از صحت وجود اطلاعات دوباره امتحان کنید.",
      onClosing: function () {
        BackExportModal.click();
      },
    });
  }
}

function ImporTabletData() {
  var ImportResult = ImportDataValue.value;
  if (ImportResult === "") {
    iziToast.warning({
      title: "هشدار",
      message: "ورودی مقدار خالی را پر کنید",
    });
  } else {
    localStorage.setItem("TableInfo", ImportResult);
    var Tables = JSON.parse(localStorage.getItem("TableInfo"));
    localStorage.setItem("Last-Item-Id", JSON.stringify(Tables.length));
    location.reload();
  }
}

function CreatChartWithDetails() {
  chart.render();
  UpdateChart();
}

function UpdateChart() {
  chart.updateSeries([
    {
      name: "درآمد",
      data: ChartDetails.series[0].data,
    },
    {
      name: "هزینه",
      data: ChartDetails.series[1].data,
    },
  ]);
}

function AddDataToChart(DataType, MonthNumber, Amount) {
  var MonthResult;
  switch (true) {
    case MonthNumber === "1" || MonthNumber === "01":
      MonthResult = "1";
      break;
    case MonthNumber === "2" || MonthNumber === "02":
      MonthResult = "2";
      break;
    case MonthNumber === "3" || MonthNumber === "03":
      MonthResult = "3";
      break;
    case MonthNumber === "4" || MonthNumber === "04":
      MonthResult = "4";
      break;
    case MonthNumber === "5" || MonthNumber === "05":
      MonthResult = "5";
      break;
    case MonthNumber === "6" || MonthNumber === "06":
      MonthResult = "6";
      break;
    case MonthNumber === "7" || MonthNumber === "07":
      MonthResult = "7";
      break;
    case MonthNumber === "8" || MonthNumber === "08":
      MonthResult = "8";
      break;
    case MonthNumber === "9" || MonthNumber === "09":
      MonthResult = "9";
      break;
    case MonthNumber === "10" || MonthNumber === "10":
      MonthResult = "10";
      break;
    case MonthNumber === "11" || MonthNumber === "11":
      MonthResult = "11";
      break;
    case MonthNumber === "12" || MonthNumber === "12":
      MonthResult = "12";
      break;
  }
  if (DataType === "income") {
    ChartDetails.series[0].data[Number(MonthResult) - 1] += Number(Amount);
    localStorage.setItem(
      "IncomeListChart",
      JSON.stringify(ChartDetails.series[0].data)
    );
  } else {
    ChartDetails.series[1].data[Number(MonthResult) - 1] += Number(Amount);
    localStorage.setItem(
      "CostListChart",
      JSON.stringify(ChartDetails.series[1].data)
    );
  }
  UpdateChart();
}

function CreatChartWithLocalStorage() {
  IncomeResult = JSON.parse(localStorage.getItem("IncomeListChart"));
  CostResult = JSON.parse(localStorage.getItem("CostListChart"));
  if (IncomeResult === null) {
    ChartDetails.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  } else if (CostResult === null) {
    ChartDetails.series[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  } else {
    ChartDetails.series[0].data = IncomeResult;
    ChartDetails.series[1].data = CostResult;
    UpdateChart();
  }
}
