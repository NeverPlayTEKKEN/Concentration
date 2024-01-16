const start_row = 4;
const start_col = 2;

const rec_row = 9;
const rec_a_col = 3;
const rec_b_col = 7;

sht = SpreadsheetApp.getActiveSheet();

array = [1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13]

//ファイル開いたとき
function onOpen(e){
  sht.getRange(2,2).setValue("ようこそ神経衰弱へ！");
  sht.getRange(start_row, start_col, 4, 13).setBackgroundRGB(255,255,200);
  SpreadsheetApp.flush();
}
//スタートボタンを押す
//配列が作成され、パラメータに格納される。
//セルの色が変わる
function onStart(){
  sht.getRange(2,2).setValue("ちょっとまってね...");
  sht.getRange(rec_row,rec_a_col).setValue(0);
  sht.getRange(rec_row,rec_b_col).setValue(0);
  sht.getRange(start_row, start_col, 4, 13).setBackgroundRGB(150,150,255).clearContent();
  SpreadsheetApp.flush();
  PropertiesService.getScriptProperties().deleteAllProperties();
  var array = createArray();
  //setRangeValue();
  array = shuffleArray(array);
  saveArray(array);
  sht.getRange(start_row, start_col, 4, 13).setBackgroundRGB(200,100,100);
  sht.getRange(2,2).setValue("プレイヤーAのターン！");
  PropertiesService.getScriptProperties().setProperty("turn", "A");
  return;
}

//選択ボタンを押す
//セルに対応した値が表示される。
//もし二回目なら、その値が同じかどうか判別する。
function onSelect(){
  const card_val = getPostion();
  const act_cell = sht.getActiveCell();
  const act_rng = sht.getRange(act_cell.getRow(), act_cell.getColumn())
  const prop = PropertiesService.getScriptProperties();

  //もしnullでなければチェック
  const op_val = prop.getProperty("op_val");
  if(act_cell.getRow() < start_row || act_cell.getRow() >= start_row + 4 || act_cell.getColumn() < start_col || act_cell.getColumn() >= start_col + 13){
    return;
  }else if(act_rng.getBackground()=="#ffffff"){
    return;
  }else{
    act_rng.setValue(card_val).setBackgroundRGB(255,255,200);
    SpreadsheetApp.flush();
  }
  
  if(op_val == null){
    //一回目の選択
    const obj = {"op_val": card_val, "row": act_cell.getRow(), "col": act_cell.getColumn()}
    prop.setProperties(obj)
  }else{
    //二回目の選択
    if(prop.getProperty("row")==act_cell.getRow() && prop.getProperty("col")==act_cell.getColumn()){
      return;
    }else if(op_val == card_val){
      //正解
      act_rng.setBackground("white").clearContent();
      sht.getRange(parseInt(prop.getProperty("row"),10), parseInt(prop.getProperty("col"),10)).setBackground("white").clearContent();
      if(prop.getProperty("turn")=="A"){
        sht.getRange(rec_row, rec_a_col).setValue(sht.getRange(rec_row, rec_a_col).getValue()+10);
      }else{
        sht.getRange(rec_row, rec_b_col).setValue(sht.getRange(rec_row, rec_b_col).getValue()+10);
      }
      if(sht.getRange(rec_row, rec_a_col).getValue() + sht.getRange(rec_row, rec_b_col).getValue()==260){
        Browser.msgBox("ゲームセット！");
      }
    }else{
      //不正解
      act_rng.setBackgroundRGB(200,100,100).clearContent();
      sht.getRange(parseInt(prop.getProperty("row"),10), parseInt(prop.getProperty("col"),10)).setBackgroundRGB(200,100,100).clearContent();
      if(prop.getProperty("turn")=="A"){
        prop.setProperty("turn", "B");
      }else{
        prop.setProperty("turn", "A");
      }
    }
    sht.getRange(2,2).setValue("プレイヤー" + prop.getProperty("turn") + "のターン！");
    prop.deleteProperty("op_val");
    prop.deleteProperty("row");
    prop.deleteProperty("col");
  }
  return;
}

//1~4*13の配列を作成する
function createArray() {
  var result = [];

  for (var i = 1; i <= 13; i++) {
    for (var j = 0; j < 4; j++) {
      result.push(i);
    }
  }

  return result;
}

//配列をシャッフルする
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)); // 0からiまでのランダムなインデックスを生成
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//データをプロパティに保存する
function saveArray(array){
  var row = start_row;
  var col = start_col;
  for (var i = array.length - 1; i >= 0; i--){
    const key = String(row) + "_" + String(col);
    console.log("key:value=" + key + ":" + array[i]);
    PropertiesService.getScriptProperties().setProperty(key, String(array[i]));
    if(col == start_col + 12){
      row += 1;
      col = start_col;
    }else{
      col += 1;
    }
  }
}

//選択しているセルの位置を取得し、そこに格納されている値を返す
function getPostion(){
  act_cell = sht.getActiveCell();
  act_row = act_cell.getRow();
  act_col = act_cell.getColumn();

  card_val = PropertiesService.getScriptProperties().getProperty(String(act_row) + "_" + String(act_col))
  console.log(String(act_row) + "_" + String(act_col));
  console.log(card_val);
  return card_val;
}

//セルに配列の値を代入
function setArray(array){
  for(i=start_row; i<start_row+4; i++){
    rng = sht.getRange(i, start_col, 1, 13);
    value = array.slice(i-start_row, (i-start_row)*13);
    console.log(value);
    rng.setValues(value);
  }
}
