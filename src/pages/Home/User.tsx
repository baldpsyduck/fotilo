import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {useAppSelector} from '../../store/hooks';
import Button from '../../components/Button';
import {useLocation, useNavigate} from 'react-router-native';
import {useAppDispatch} from '../../store/hooks';
import {set as setMe} from '../../store/features/userSlice'
import {set} from '../../store/features/imgCSlice';
import Input from '../../components/Input';
import {defaultColor} from '../../static/color';
import {changeInfo, getUser, logout} from '../../api';
import {emptyUser} from '../../config/user';
import {HamburgerIcon} from 'native-base';

const AvatarSize = 160;

export default function User() {
  const navigation = useNavigate();

  const {state} = useLocation();
  const {userId: uID} = state as any;

  const {userId} = useAppSelector(store => store.user);
  const [user, setUser] = useState(emptyUser);

  const [img, setImg] = useState<any>(
    user.avatar
      ? {uri: user.avatar}
      : require('../../static/img/defaultAvatar.png'),
  );
  // username 修改
  const [name, setName] = useState<string>(user.username);
  const [cName, setCName] = useState<boolean>(false);
  const nowName = useRef(user.username);
  // description 修改
  const [des, setDes] = useState<string>(user.description || '');
  const [cDes, setCDes] = useState<boolean>(false);
  const nowDes = useRef(user.description);
  useEffect(() => {
    getUser(uID, 'GETNUM')
      .then(e => {
        setUser({...e.data.data});
        setName(e.data.data.username);
        nowName.current = e.data.data.username;
        setDes(e.data.data.description || '');
        nowName.current = e.data.data.description || '';
        setImg(
          e.data.data.avatar
            ? {uri: e.data.data.avatar}
            : require('../../static/img/defaultAvatar.png'),
        );
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  const dispatch = useAppDispatch();

  // 头像选择
  const chooseAvatar = () => {
    dispatch(set({iniPic: img, show: true, scale: 1}));
  };

  /* 
    Drawer动画
  */
  const fade = useRef(new Animated.Value(0)).current;
  const [isFade, setIsFade] = useState(false);
  const fadeIn = () => {
    Animated.timing(fade, {
      duration: 300,
      useNativeDriver: false,
      toValue: 0.8,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(fade, {
      duration: 300,
      useNativeDriver: false,
      toValue: 0,
    }).start();
  };

  return (
    <>
      <ImageBackground
        style={{...styles.background}}
        source={require('../../static/img/Ubackground.png')}
      />
      <View style={[styles.settingC]}>
        <Button
          style={styles.setting}
          onPress={() => {
            !isFade ? fadeIn() : fadeOut();
            setIsFade(!isFade);
          }}>
          <HamburgerIcon color={'white'} />
        </Button>
        <Animated.View style={[styles.drawer, {opacity: fade}]}>
          <Button
            onPress={() => {
              logout()
                .then(e => {
                  dispatch(setMe(emptyUser))
                  fadeOut();
                  setIsFade(!isFade);
                  navigation('/startP')
                })
                .catch(e => {
                  console.log(e);
                });
            }}
            style={styles.drawerBtn}>
            <Text style={[styles.settingT]}>登出</Text>
          </Button>
          <Button
            onPress={() => {
              navigation('/startP/login');
              fadeOut();
              setIsFade(!isFade);
            }}
            style={styles.drawerBtn}>
            <Text style={[styles.settingT]}>切换账号</Text>
          </Button>
        </Animated.View>
      </View>

      <View style={{...styles.backgroundSpace}} />

      <View style={{...styles.avatarC}}>
        <View style={{...styles.avatarAround}}>
          <Text style={{...styles.aroundT}}>视频数&nbsp;&nbsp;</Text>
          <Text style={{...styles.aroundT}}>
            {user.videoNum || 0}&nbsp;&nbsp;
          </Text>
        </View>
        {userId ? (
          <Button
            style={{...styles.avatar}}
            onPress={() => {
              userId === uID && chooseAvatar();
            }}>
            <Image style={{...styles.avatar}} source={img} />
          </Button>
        ) : (
          <Button
            style={{...styles.avatar}}
            onPress={() => {
              navigation('../../StartP/login');
            }}>
            <Text style={{...styles.avatarT}}>登</Text>
            <Text style={{...styles.avatarT}}>录</Text>
          </Button>
        )}

        <View style={{...styles.avatarAround}}>
          <Text style={{...styles.aroundT}}>获赞数&nbsp;&nbsp;</Text>
          <Text style={{...styles.aroundT}}>
            {user.supportedNum || 0}&nbsp;&nbsp;
          </Text>
        </View>
      </View>
      <View style={{...styles.userN}}>
        <Button style={styles.userNTB} onPress={() => {}}>
          {cName ? (
            <Input
              textStyle={styles.cnameT}
              iconSide="none"
              onChangeText={e => {
                nowName.current = e || nowName.current;
              }}
              onBlur={() => {
                setName(nowName.current);
                setCName(false);
              }}
              defaultValue={name}
            />
          ) : (
            <Text style={{...styles.userNT}}>
              {name || '用户未登录'}&nbsp;&nbsp;
            </Text>
          )}
        </Button>
        <Button
          style={styles.userNTB}
          onPress={() => {
            if (uID === userId) {
              setCDes(true);
            }
          }}>
          {cDes ? (
            <Input
              textStyle={styles.cnameT}
              iconSide="none"
              onChangeText={e => {
                nowDes.current = e;
              }}
              onBlur={() => {
                setDes(nowDes.current || '');
                changeInfo(nowDes.current || '')
                  .then(e => {
                    console.log(e);
                  })
                  .catch(e => {
                    console.log(e);
                  });
                setCDes(false);
              }}
              defaultValue={des}
            />
          ) : (
            <Text style={{...styles.desNT}}>
              {des || '该用户目前还没有介绍~'}&nbsp;&nbsp;
            </Text>
          )}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  avatarC: {
    height: AvatarSize,
    width: '100%',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  avatar: {
    width: AvatarSize,
    height: AvatarSize,
    borderRadius: AvatarSize / 2,
  },
  background: {
    height: 200 + AvatarSize / 2,
    width: '100%',
    position: 'absolute',
  },
  backgroundSpace: {
    height: 200,
  },
  avatarAround: {
    alignItems: 'center',
  },
  aroundT: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'ABeeZee',
  },
  userN: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNT: {
    color: 'white',
    fontSize: 30,
  },
  desNT: {
    color: defaultColor,
  },
  avatarT: {
    fontSize: 40,
    color: 'white',
  },
  userNTB: {
    backgroundColor: 'transparent',
  },
  cnameT: {
    color: 'white',
  },
  setting: {
    backgroundColor: 'transparent',
  },
  settingC: {
    zIndex: 999,
    position: 'absolute',
    alignItems: 'flex-start',
    padding: 5,
  },
  drawer: {
    backgroundColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
    opacity: 0.8,
    padding: 5,
  },
  settingT: {
    color: 'white',
    fontSize: 20,
  },
  drawerBtn: {
    backgroundColor: 'transparent',
    height: 50,
  },
});