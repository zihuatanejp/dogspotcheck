import React, { Component } from 'react';
import {
   Text, View, Image, StyleSheet, TouchableOpacity, Modal, Alert,
   Linking, Button,Picker
} from 'react-native';


let log = console.log;

export default class Page extends Component {
  constructor(props) {
		super(props);
		this.state = {
      currentwordentry:' ', // 当前单词项
      currentword:' ', // 当前显示单词
      currentwordmean:' ', // 当前显示单词的意思
      currentwordind:' ', // 当前显示单词是第几个
      currentwordvisble:false, // 当前显示单词是第几个 从1开始
      currentwrongcnt:0, // 当前错误几个
      nextbtn:'显示答案', // 下一步按钮的状态 '显示答案','下一个','完成'
      randomwords:[],  // 随机后所有词组
      cupagests:'start', // 当前页面
      startsection:'0', // 起始章节
      endsection:'0', // 结束章节
      startsections:[], // 开始的选择项
      endsections:[] // 结束章节的选择项
    };
    this.shufflearr = this.shufflearr.bind(this);
    this.ranNum = this.ranNum.bind(this);
    this.onPress = this.onPress.bind(this);
    this.genpickeritem = this.genpickeritem.bind(this);
    this.startsectionselect = this.startsectionselect.bind(this);
    this.endsectionselect = this.endsectionselect.bind(this);
    this.startbtnpress = this.startbtnpress.bind(this);
    this.setcurrentword = this.setcurrentword.bind(this);
    this.handlenext = this.handlenext.bind(this);
    this.addwrongcnt = this.addwrongcnt.bind(this);
    this.resetpage = this.resetpage.bind(this);
    this.nextword = this.nextword.bind(this);
	}

  // 数组洗牌
  shufflearr(str){
    let arr = str.toString().split("\n")
    arr = arr.filter( (item)=>item )  // 去掉空数组项

    arr.forEach( (v,i)=>{
      let num = this.ranNum(0,arr.length)
      let tmp = v
      arr[i] = arr[num]
      arr[num] = tmp
    } )
    return arr
  }

  // 生成指定范围的随机数(0,5):0,1,2,3,4
  ranNum(a,b){
    let n = Math.abs(a - b );
    let base_n = a;
    if(a > b){ base_n = b; }
    let res = Math.floor(Math.random()*n) + base_n;
    return res;
  }

  //生成指定数量和范围的 开始的选择项
  genpickeritem(cnt,ind=1){
    let items = Array(cnt).fill(0).map(
       (v,i)=>{
         return ( <Picker.Item label={ (ind+i).toString() } value={ (ind+i).toString() } key={i} /> );
       }
     )
    return items
  }

  //选择开始章节
  startsectionselect(val){
    let allwords = this.props.words
    let sectionlen = allwords.length
    let valint = parseInt(val)
    let endsections = this.genpickeritem( (sectionlen-valint+1),valint )
    this.setState({ startsection:val, endsections})
    if( parseInt(this.state.endsection) < valint ){
      this.setState({ endsection : val })
    }
  }

  //选择结束章节
  endsectionselect(val){
    this.setState({ endsection:val })
  }

  // 拆解，设置当前单词项
  setcurrentword(word){
    let arr = word.split(",")
    let [currentword,...currentwordmean] = arr
    currentwordmean = currentwordmean.join("  ")
    currentwordind = 1;
    this.state.randomwords.forEach( (v,i)=>{
      if(v==word){ currentwordind = (i+1); }
    } )
    this.setState({
      currentwordentry:word,
      currentword,
      currentwordmean,
      currentwordind,
      currentwordvisble:false
    })
  }

  // 切换到下一个单词
  nextword(){
    this.state.randomwords.forEach( (v,i,arr)=>{
      if( this.state.currentwordentry == v ){
        if( i==(arr.length-1) ){
          this.setState({
            currentwordvisble:true,
            nextbtn:'完成'
          })
        }
        else{
          this.setcurrentword(arr[(i+1)]);
          this.setState({
            currentwordvisble:false,
            nextbtn:'显示答案'
          })
        }
      }
    } )
  }

  // 点击开始时 根据开始和结束章节随机单词
  startbtnpress(){
    let allwords = this.props.words
    startsection = parseInt(this.state.startsection)
    endsection = parseInt(this.state.endsection)
    wordsrange = allwords.slice( (startsection-1),(endsection) ).join("\n")
    let randomwords = this.shufflearr(wordsrange)
    // log(randomwords)
    this.setState({
      randomwords,cupagests:'testing',
    },
    ()=>{ this.setcurrentword(randomwords[0]); }
    )
  }

  // 处理下一步
  handlenext(){
    if(this.state.nextbtn=='显示答案'){
      // log('显示答案')
      this.setState({
        currentwordvisble:true,
        nextbtn:'下一个'
      })
    }
    if(this.state.nextbtn=='下一个'){
      // log('下一个')
      this.nextword();
    }
    if(this.state.nextbtn=='完成'){
      this.resetpage()
    }
  }

  // 点击重新开始 重置app 回到第一页
  resetpage(){
    this.setState({
      currentwordvisble:false,
      currentwrongcnt:0,
      nextbtn:'显示答案',
      cupagests:'start'
    })
  }

  // 增加记错个数
  addwrongcnt(){
    this.setState(
      prevState => ({
        currentwrongcnt: prevState.currentwrongcnt + 1
      })
    );
  }

  onPress(){}

  //页面初始加载完
	componentDidMount() {
    let allwords = this.props.words
		this.setState({
      startsections: this.genpickeritem(allwords.length),
      endsections: this.genpickeritem(allwords.length),
      startsection:'1',
      endsection:allwords.length.toString()
		});
  }

  render() {
    let pagestart = (
      <View style={styles.con}>
        <View style={[styles.box]} >
          <Text style={styles.welcome}>
            抽查，检查不过有惩罚!
          </Text>
        </View>
        <View style={styles.checkrange}>
          <View style={[styles.box]}>
            <Text>词汇范围：</Text>
          </View>
          <View style={[styles.box,styles.rangetxt]} >
            <Text>第</Text>
            <Picker
              style={[styles.picker]}
              selectedValue={this.state.startsection}
              onValueChange={ this.startsectionselect }
              // mode={'dropdown'}
            >
              {this.state.startsections}
            </Picker>
            <Text>章--至--</Text>
            <Text>第</Text>
            <Picker
              style={[styles.picker]}
              selectedValue={this.state.endsection}
              onValueChange={ this.endsectionselect }
            >
              {this.state.endsections}
            </Picker>
            <Text>章</Text>
          </View>
        </View>
        <View style={[styles.box,styles.startbtnbox]}>
          <Button
            onPress={this.startbtnpress}
            title="开始"
            color="#008CBA"
          />
        </View>
      </View>
    );
    let pagetesting =(
      <View style={styles.con}>
        <Text style={styles.welcome}>
          第{this.state.currentwordind}个，错误:{this.state.currentwrongcnt}
        </Text>
        <View style={styles.displayrange}>
          <View style={[styles.box]}>
            <Text>词汇范围：</Text>
          </View>
          <View style={[styles.box,styles.rangetxt]} >
            <Text>
              第{this.state.startsection}章-至-第{this.state.endsection}章
            </Text>
          </View>
        </View>
        <View style={[styles.box,styles.wordbox]}>
          <Text style={styles.word}>{this.state.currentword}</Text>
        </View>
        {
          this.state.currentwordvisble?(
            <View style={[styles.box,styles.meanbox]}>
              <Text style={[styles.wordmean]}>{this.state.currentwordmean}</Text>
            </View>
          ):null
        }
        <View style={styles.box}>
          <View style={ { marginBottom:30 } }>
            <Button
              onPress={this.handlenext}
              title={this.state.nextbtn}
              color="#4CAF50"
            />
          </View>
          {
            this.state.nextbtn!='完成'?(
              <View style={[styles.twobtnarea]}>
                <View style={[styles.elgrow,styles.lfel]}>
                  <Button
                    onPress={this.resetpage}
                    title="重新开始"
                    color="#008CBA"
                  />
                </View>
                <View style={[styles.elgrow,styles.riel]}>
                  <Button
                    onPress={this.addwrongcnt}
                    title="记错"
                    color="#f44336"
                  />
                </View>
              </View>
            ):null
          }
        </View>
      </View>
    )
    let cupage = null;
    if(this.state.cupagests == 'start'){
      cupage = pagestart;
    }
    if(this.state.cupagests =='testing'){
      cupage = pagetesting;
    }
    return (
      <View style={styles.container} >{cupage}</View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection:'row',
    padding:10
  },
  con:{
    flex:1,
    // borderWidth:1,
    // borderColor:'blue'
  },
  box:{
    padding:5
  },
  welcome:{
    fontSize:16,
    color:'#555',
    textAlign:'center'
  },
  checkrange:{
    // borderWidth:1,
    // borderColor:'pink',
    flexDirection:'row',
    flexWrap:'wrap'
  },
  displayrange:{
    // borderWidth:1,
    // borderColor:'pink',
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'center'
  },
  rangetxt:{
    flexDirection:'row',
    flexWrap:'wrap'
  },
  startbtnbox:{
    borderRadius:12,
    marginVertical:15
  },
  picker:{
    width:100,
    height:30,
    // borderWidth:1,
    // borderColor:'pink'
  },
  wordbox:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  word:{
    fontSize:22,
    color:'#222',
    marginVertical:10
  },
  meanbox:{
    borderWidth:1,
    borderColor:'#4CAF50',
    paddingHorizontal:15,
    marginHorizontal:30,
    borderRadius:30,
    marginBottom:35,
    borderStyle:'dashed'
  },
  wordmean:{
    fontSize:14,
    color:"#555"
  },
  twobtnarea:{
    flexDirection:'row',
    flexWrap:'nowrap',
    justifyContent:'space-between'
  },
  elgrow:{
    flexGrow:1
  },
  lfel:{
    marginRight:15
  },
  riel:{
    marginLeft:15
  }
})
