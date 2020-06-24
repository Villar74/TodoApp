//Я же просил сделать нормальные оступы и сверстать нормально код
import React, {Component} from 'react';
import {Text,
        View,
        TextInput,
        StyleSheet,
        Button,
        FlatList,
        TouchableOpacity
       } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
export default class App extends Component {

  state={
    text:'',
    done:false,
    //тебе самому так удобно читать когда это все в одну строку?
    list: [{todos:'1',index:0,isDone:false},{todos:'2',index:1,isDone:true},{todos:'3',index:2,isDone:false},]

  };

//для читабельности кода надо передавать сюда текущий стейт текста и списка, а не брать его самому
  addItem = async ()=>{
    //я же не просто так написал про то что надо подумать как скопировать массив, скорее всего эта операция не копирует его а делает ссылку на него просто
    //подробнее тут https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
    //так как у тебя не простой массив а вложенный то надо делать как в этой статье написано про это const nestedCopyWithHack = JSON.parse(JSON.stringify(nestedArray)) // Make a deep copy
    let copyList = this.state.list;
    let text = this.state.text;
    //зачем тебе рандом для индекса, ты инкрементировать индекс последнего элемента же просто можешь и получить новый индекс, так удобнее будет считать
    //количество общих созданных и удаленных тудух например
    copyList.push({todos:text,index:Math.random(),isDone:false});

    this.setState({list:copyList});
    try {
      //я же тебе говорил уже что сетстейт АСИНХРОННАЯ функция, на 33 строке ты меняешь лист и тебе остается молиться чтобы стейт успел поменяться перед этой строкой.
      //вместо стейта передай сюда copyList и все
        const jsonValue = JSON.stringify(this.state.list);
      //зачем ты ради AsyncStorage.setItem сделал асинк, ты этим просто блокируешь поток, все равно ты не ждешь результата выполнения setItem, а значит и асинк-await не нужен
        await AsyncStorage.setItem('saveList', jsonValue);
        console.log(jsonValue);
    } catch (e) {
      //если ты написал функцию асинка ради catch не проще было сделать AsyncStorage.setItem('saveList', jsonValue).catch(e=>alert(e))?
        alert(e)
    }

  };

//delete
  delite = async (item,index)=>{
    //все то же самое тут
        let copyList = this.state.list;
        copyList.splice(index,1);
        this.setState({list:copyList});
      try {
          const jsonValue = JSON.stringify(this.state.list);
          await AsyncStorage.setItem('saveList', jsonValue);
          console.log(jsonValue);
      } catch (e) {
          alert(e)
      }
  };//почему где то есть отступ между функциями а тут нет
  doneTask = async  (index)=>{
    //все то же самое тут
      let copyList = this.state.list;
    //поэтому сейчас когда ты модифицируешь copyList на самом деле ты модифицируешь this.state.list
      copyList[index].isDone = !copyList[index].isDone;
      this.setState({list:copyList});
      try {
          const jsonValue = JSON.stringify(this.state.list);
          await AsyncStorage.setItem('saveList', jsonValue);
          console.log(jsonValue);
      } catch (e) {
          alert(e)
      }
    //очень интересный коммент снизу, я прошу чистый код показать)
      // alert(this.state.list[index].isDone);
  };
//зачем тебе делать асинхронный дидмаунт, чтобы заблочить весь поток? выдели отдельную функцию для загрузки данных
  componentDidMount= async ()=> {

      try {
        //эта строка бесполезна получается
          let {list} = this.state;
          let jsonValue = await AsyncStorage.getItem('saveList');
          let parsed = JSON.parse(jsonValue);
          // alert(jsonValue);
          this.setState({list:parsed});
      } catch(e) {
          alert(e);
      }

  };

    render(){
      // и снова поехал код, я же просил...
      // Зачем эта строка, когда во флэтлисте просто можно написать this.state.list
  let {list} = this.state;

  return(
      <View style={styles.container}>
        <Text style={styles.header}>ToDo app</Text>
        <View style={styles.input_view}>
          <TextInput

              onChangeText={(text)=>this.setState({text})}
//что такое this.state.value
              value={this.state.value}
              style={styles.input}/>
        </View>
        <View>
                //рендерайтем выноси в отдельную функцию чтобы не захламлять код экрана
          <FlatList data={list} renderItem={({item, index})=>{
            return(
                <View  style={styles.listbox}>
                <TouchableOpacity key={index}  onPress={()=>this.doneTask(index)} style={styles.listbox_button}>
              //эту строку невозможно прочитать, надо было разбить на несколько строк
                  <Text style={[item.isDone?styles.done_text:styles.undone_text,{width:'80%'}]}>{item.todos}</Text>
                </TouchableOpacity>
//а title правильно написал
                    <Button  onPress={()=>this.delite(item,index)} title='Delete'/>
                </View>
            )
          }}/>

        </View>
        <TouchableOpacity  onPress={this.addItem} style={styles.button} >
          <Text style={styles.button_text}>+</Text>
        </TouchableOpacity>
      </View>
  )
}
};
const styles = StyleSheet.create({
    container: {
        height:'100%'
    },
    input: {
        height:40,
        width:'100%',
        borderWidth:1,
        borderColor:'black'
    }
    ,
    input_view:{
        flexDirection:'row',
        position:'absolute',
        bottom:0
    },
    done_text: {
        textDecorationLine: 'line-through'
    },
    undone_text: {
        textDecorationLine: 'none'
    },
    button:{
        width:50,
        height:50,
        backgroundColor:'blue',
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        right:20,
        bottom:50,
        color:'white'
},
    button_text:{
        color:'white',
        fontSize:35
    },
    header:{
        backgroundColor:'blue',
        color:'white',
        height:30,
        textAlign:'center',
        paddingTop:5
    },
    listbox:{
        flexDirection:'row'
    },
    listbox_button:{
        flexDirection:'row'
    },


});
