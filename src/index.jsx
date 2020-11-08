import { contentView, app, fs, statusBar, navigationBar, TextView, Popover, NavigationView, ProgressBar, Page, Button, Stack, ScrollView, Composite, Row, navigationBar, TextInput } from 'tabris';
import { mean, map, replace, padStart, replcae, find, random, shuffle, uniqBy, findIndex, sum, repeat } from "lodash";
import * as crypto from "crypto-js"
const Hashids = require('hashids/cjs');
const hash = new Hashids("nabeel adnan ali nizam", 12, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789")


app.idleTimeoutEnabled = false;
app.registerFont('dubai', 'resoruces/Cairo.TTF');

const success = '#00C853'
const error = '#FF7171'
const warrning = '#FFA000'
const brand = '#333431'
const secondary = '#D7D8D2'
const font_headline = 'bold 25px dubai';
const font_body = 'bold 20px dubai ';


//* theme 
statusBar.background = brand
statusBar.theme = 'dark'
navigationBar.background = brand;
navigationBar.theme = 'dark'


let db = [];
let paid = []
let path = fs.filesDir + '/blsm.json'
if (fs.isFile(path) == false) {
  write().then(() => read());
} else {
  read();
}

if (secureStorage.getItem('paid') == null) {
  secureStorage.setItem('paid', JSON.stringify(paid))
}
paid = JSON.parse(secureStorage.getItem('paid'));

async function write() {
  let en = crypto.AES.encrypt(JSON.stringify(db), 'Nabeel Adnan Ali Nizam, Mom I love you').toString();
  await fs.writeFile(path, en, 'utf-8')
}

async function read() {
  let blsm_json = await fs.readFile(path, 'utf-8');
  let de = crypto.AES.decrypt(blsm_json, 'Nabeel Adnan Ali Nizam, Mom I love you').toString(crypto.enc.Utf8);
  db = JSON.parse(de);
  $(NavigationView).only().children().dispose()
  $(NavigationView).only().append(<Home />)
}


contentView.append(
  <$>
    <NavigationView stretch toolbarVisible={false}>
      <Home />
    </NavigationView>
  </$>
);



function Home() {
  let Toolbar = () => {
    let achive = 0
    if (db.length > 0) {
      achive = cal_achivement();
    }
    return (
      <Composite stretchX >
        <TextView right centerY markupEnabled font='bold 25px dubai' text='بلسم' />
        <TextView right='prev() 5' centerY markupEnabled font='bold 16px dubai' text='💊' />

        <Composite centerY background={success} width={30} height={30} cornerRadius={15} left>
          <TextView id='achive' centerY centerX textColor='white' text={achive} />
        </Composite>
      </Composite>
    )
  }
  let Subjects = () => {
    let subjects = [...new Set(map(db, 'subject'))];
    let output = []
    subjects.forEach(subject => {
      output.push(handle_subjects(subject))
    })
    return (
      <ScrollView id='subjects' top='2' stretchX direction='horizontal' scrollbarVisible={false} right >
        <Row id='row' spacing={10} alignment='stretchX' right>
          {output}
        </Row>
      </ScrollView>
    )
  }
  let Files = () => {
    let output = []
    db.forEach(file => {
      output.push(
        handle_files(file)
      )
    })

    return (
      <ScrollView id='files' top='10' stretch direction='vertical' scrollbarVisible={false}>
        <Stack id='main' spacing={15} stretchX alignment='stretchX' right >
          {output}
        </Stack>
      </ScrollView>
    )
  }
  let Add = () => {
    return (
      <Composite centerX padding={14} cornerRadius={30} background='#333431' bottom={35} elevation={10} highlightOnTouch onTap={() => add_file()} >
        <TextView id='text' textColor='white' text='إضــافة ملــف +' font='bold 16px dubai' />
      </Composite>)
  }
  let Snackbar = () => {
    return (
      <Composite right={10} left={10} visible={false} stretchX padding={10} cornerRadius={3} background='#048243' bottom={16} elevation={5}>
        <TextView id='text' right text='notification' font='bold 16px dubai' />
        <TextView id='icon' left text='✅' font='bold 16px dubai' />
      </Composite>
    )
  }

  function Icon(file) {
    let data = file.subject;
    let output;
    switch (data.subject) {
      case 'تشريح العصبية':
        output = '🧠'
        break;
      case 'تشريح':
        output = '🗡'
        break;
      case 'الأحياء الدقيقة':
        output = '🦠'
        break;
      case 'فيزيولوجيا':
        output = '💉'
        break;
      case 'الكيمياء الحيوية':
        output = '🧪'
        break;
      case 'الإحصاء الطبي':
        output = '🔢'
        break;
      case 'الأخلاقيات الطبية':
        output = '🍎'
        break;
      case 'مهارات السريرية':
        output = '🩺'
        break;
      default:
        output = '📔'
        break;
    }
    return (
      <TextView right baseline='next()' text={output} font='20px' />
    )
  }
  function handle_files(file) {
    return (
      <Composite highlightOnTouch stretchX background='#D7D8D2' cornerRadius={15} padding={16} height='100' onTap={() => {
        const popover = Popover.open(
          <Popover>
            <Stack centerY stretchX spacing={10} padding={16} onSwipeDown={() => popover.close()}>
              <Stack stretchX>
                <Button font='bold 14px  dubai' style='flat' background={error} text='حذف الملف' textColor='white' onSelect={() => { delete_file(file.title), popover.close() }} />
                <Composite background='#333431' stretchX padding={16} cornerRadius={16}>
                  <TextView right left={0} top={0} text={file.title} textColor='white' font='bold 22px dubai' />
                  <TextView right top='prev() 1' textColor='white' text={file.subject} font='16px dubai' />
                  <TextView visible={file.cycle.length > 3 ? true : false} right='prev() 10' bottom text={`• دورة ${file.cycle}`} textColor={error} font='bold 16px dubai' />
                </Composite>
              </Stack>


              <Composite stretchX background='#F4D7D7' padding={16} cornerRadius={16}>
                <TextView right text='💯' font='bold 20px dubai' />
                <TextView right='prev() 3' text='متوسط الدقة' font='bold 20px dubai' />
                <TextView left='3' text={file.avarageAcc} font='20px dubai' />
              </Composite>

              <Composite stretchX >
                <Composite left='48%' right={0} background='#7BC8F6' padding={16} cornerRadius={16}>
                  <TextView right text='📄' font='bold 20px dubai' />
                  <TextView right='prev() 3' text='عدد الأسئلة' font='bold 20px dubai' />
                  <TextView top='prev() 2' centerX text={file.questionlist.length} font='20px dubai' />
                </Composite>
                <Composite left right='48%' background='#CFFDBC' padding={16} cornerRadius={16}>
                  <TextView right text='⚡️' font='bold 20px dubai' />
                  <TextView right='prev() 3' text='عدد المرات' font='bold 20px dubai' />
                  <TextView top='prev() 2' centerX text={file.numOfQuiz} font='20px dubai' />
                </Composite>
              </Composite>

              <Composite stretchX padding={18} cornerRadius={16} highlightOnTouch background={file.paid ? error : success} onTap={() => { file.paid ? go_to_active() : go_to_exam(file), popover.close() }}>
                <TextView centerX centerY text={file.paid ? 'تفعيل البنك' : 'خوض الامتحان'} font='bold 20px dubai' />
              </Composite>
            </Stack>
            <TextView bottom={5} centerX text='للإغلاق اسحب للأسفل' font='14px dubai' textColor='#616161' />
          </Popover>
        )
      }}>
        <Icon subject={file} />
        <TextView right='prev() 5' markupEnabled>
          <span font='bold 20px dubai '>{file.title}</span><br />
          <span font='16px dubai'>{file.subject}</span>
        </TextView>
        <Composite left id='cool' cornerRadius={14} width='28' height='28' background='#333431'>
          <TextView font='16px dubai' centerY centerX textColor='white' text={file.questionlist.length} />
        </Composite>

        <TextView visible={file.cycle.length > 3 ? true : false} font='16px dubai' left top='#cool 10' textColor='#FD4659' text={`دورة ${file.cycle}`} />
      </Composite>
    )
  }
  function handle_subjects(subject) {
    if (db.length > 0) {
      let underscore = replace(subject, ' ', '_');
      let hash_subject = padStart(underscore, underscore.length + 1, '#');

      return (
        <Composite highlightOnTouch background='#333431' cornerRadius={16} padding={10} onTap={() => filter_subjects(hash_subject)} >
          <TextView text={hash_subject} textColor='white' markupEnabled font='15px dubai' />
        </Composite>
      )
    }
  }
  function filter_subjects(data) {
    let underscore = replace(data, '_', ' ');
    let subject = underscore.split('');
    subject.shift();
    let filtred_subject = db.filter(file => file.subject == subject.join(''));
    $('Files > Stack').only().children().dispose();
    filtred_subject.forEach(subject => { $('Files > Stack').only().append(handle_files(subject)) });
  }
  async function add_file() {
    try {
      let file = await fs.openFile({ type: 'text/plain', quantity: 'single' });
      let file_buffer = await file[0].arrayBuffer();
      let file_string = String.fromCharCode.apply(null, new Uint8Array(file_buffer));
      let en = crypto.AES.decrypt(file_string, "nabeel adnan ali nizam");
      let de = JSON.parse(en.toString(crypto.enc.Utf8));
      if (!db.some(file => file.title == de.title)) {
        db.unshift(de);
        // push paid to database
        if (de.paid) {
          let bank = find(paid, (o) => o.code == de.code);
          if (bank !== undefined) {
            if (bank.paid == false) {
              de.paid = false
            }
          }
          let paid_profile = {
            subject: de.subject,
            ID: hash.encode(random(10000, 1000000)),
            paid: de.paid,
            code: de.code
          }

          paid.push(paid_profile)
          paid = uniqBy(paid, "code");
          secureStorage.setItem('paid', JSON.stringify(paid))
        }
        // update the UI and database
        write().then(() => show_snackbar('تمت الإضافة بنجاح', success, '😃'));
        // write();
        $('Files > #main').only().children().dispose();
        db.forEach(file => $('Files > Stack').only().append(handle_files(file)));

        $('Subjects > Row').only().children().dispose();
        [...new Set(map(db, 'subject'))].forEach(subject => $('Subjects > Row').only().append(handle_subjects(subject)));

        // update the UI for achivement
        $('Home  > Stack > #subjects_name').set({ visible: true });

        if (db.length > 0) {
          $('Home > #placeholder').set({ visible: false })
        }
      } else {
        show_snackbar('الملف موجود سلفاً ', warrning, '😕')
      }
    } catch (error) {
      show_snackbar('لم يتم اختيار ملف', warrning, '😕');
    }
  }
  function show_snackbar(text, color, icon) {
    $('Snackbar > #text').set({ text: text });
    $(Snackbar).set({ background: color })
    $('Snackbar > #icon').set({ text: icon });
    $(Snackbar).set({ visible: true, transform: { translationY: 100 } });
    $(Snackbar).animate({ opacity: 1.0, transform: { translationX: 0 } }, { duration: 500, easing: 'ease-out' });
    setTimeout(() => {
      $(Snackbar).animate({ opacity: 1.0, transform: { translationY: 100 } }, { duration: 500, easing: 'linear' });
    }, 1500);
  }
  function delete_file(title, index) {
    db = db.filter(file => file.title !== title);
    write().then(() => show_snackbar('تم حذف الملف', warrning, '🗑'));


    $(`Home > Stack > #files > #main`).children().dispose();
    $(`Home > Stack > #subjects > #row`).children().dispose();

    db.forEach(file => $(`Home > Stack > #files > #main`).only().append(handle_files(file)));
    [...new Set(map(db, 'subject'))].forEach(subject => $(`Home > Stack > #subjects > #row`).only().append(handle_subjects(subject)));
    if (db.length > 0) {
      $('Home  > Stack > Toolbar > Composite > #achive').set({ text: cal_achivement() });
    }

    if (db.length == 0) {
      $('Home > #placeholder').set({ visible: true });
      $('Home  > Stack > #subjects_name').set({ visible: false });
      $('Home  > Stack > Toolbar > Composite > #achive').set({ text: 0 });

    }
  }

  return (
    <Page background='#fffffe'>
      <Stack stretchX stretchY right={15} left={15} top={15} bottom={5} spacing={10}>
        <Toolbar />
        <TextView id='subjects_name' visible={db.length == 0 ? false : true} text='المقررات:' font='16px dubai' right />
        <Subjects />
        <Files />

      </Stack>
      <Snackbar />
      <Add />
      <Composite id='placeholder' padding={16} visible={db.length == 0 ? true : false} stretchX stretchY top='8%'>
        <TextView right font='16px dubai' text='Telegram: @Balsam_app 👆' onTap={() => app.launch('https://t.me/Balsam_app')} />
        <TextView left font='bold 16px dubai' textColor={success} text='نسبة إنجازك 👆' />

        <TextView text='✨ بلسم يتمنى لك يوماً جميلاً ✨' font='20px dubai' center />

      </Composite>
    </Page>
  )
}

function Exam(file) {
  let score = 0;
  let progress_score = 1;
  let wrong_asnwer = false;
  let user_score = 0;
  let info = file.data

  info.questionlist = shuffle(info.questionlist);
  for (let q of info.questionlist) {
    q.choices = shuffle(q.choices)
  }

  let the_question = info.questionlist[score];

  let Question = () => {
    return (
      <TextView id='question' left={1} right={1} top={1} font='bold 20px dubai' > {the_question.question}</TextView>
    )
  }
  let Choices = () => {
    return (
      <Stack stretchX spacing={16}>
        <Composite id='b0' left={1} right={1} background='#D7D8D2' cornerRadius={5} padding={10} highlightOnTouch onTap={() => check(0)}>
          <TextView id='a1' left={1} right={1} top={1} right text={the_question.choices[0]} font='bold 16px dubai' />
        </Composite>
        <Composite id='b1' left={1} right={1} background='#D7D8D2' cornerRadius={5} padding={10} highlightOnTouch onTap={() => check(1)}>
          <TextView id='a2' left={1} right={1} top={1} right text={the_question.choices[1]} font='bold 16px dubai' />
        </Composite>
        <Composite id='b2' left={1} right={1} background='#D7D8D2' cornerRadius={5} padding={10} highlightOnTouch onTap={() => check(2)}>
          <TextView id='a3' left={1} right={1} top={1} right text={the_question.choices[2]} font='bold 16px dubai' />
        </Composite>
        <Composite id='b3' left={1} right={1} background='#D7D8D2' cornerRadius={5} padding={10} highlightOnTouch onTap={() => check(3)}>
          <TextView id='a4' left={1} right={1} top={1} right text={the_question.choices[3]} font='bold 16px dubai' />
        </Composite>
      </Stack>
    )
  }
  let Snackbar = () => {
    return (
      <Composite right={10} left={10} visible={false} stretchX padding={10} cornerRadius={3} background='#048243' bottom={16} elevation={5}>
        <TextView id='text' right textColor='white' text='notification' font='bold 16px dubai' />
        <TextView id='icon' left text='✅' font='bold 16px dubai' />
      </Composite>
    )
  }
  let Footer = () => {
    return (
      <Composite bottom={50} padding={16} stretchX right>
        <TextView visible={false} id='explain' right bottom='next() 5' text='للاطلاع على شرح السؤال اسحب للأعلى 👆' font=' 15px dubai' textColor='#455A64' />
        <TextView visible={false} id='swipe_next' right text='للانتقال للسؤال التالي اسحب باتجاه اليمين 👉' font=' 15px dubai' textColor='#455A64' />
      </Composite>
    )
  }
  let BottomSheet = () => {
    return (
      <Composite visible={false} bottom={0} padding={10} background='#F4D7D7' stretchX >
        <TextView id='explain' left={1} right={1} text='explanation' font='bold 21px dubai' />
        <TextView top='prev() 1' bottom centerX text='اسحب للأسفل أو اليمين' font='15px dubai' />
      </Composite>
    )
  }


  function check(index) {
    let right = info.questionlist[score].right;
    let answer = info.questionlist[score].choices[index]
    let right_index = info.questionlist[score].choices.indexOf(right);
    if (!wrong_asnwer) {
      if (right == answer) {
        show_snackbar('جواب صحيح', success, '😎');
        next_question();
      } else {
        wrong_asnwer = true;
        user_score++;
        $(`Choices > #b${right_index}`).set({ background: '#00C853' });
        $('Footer > #swipe_next').set({ visible: true });

        $(ProgressBar).set({ state: 'error' });

        if (info.questionlist[score].qexplain.length > 3) {
          $('Footer > #explain').set({ visible: true });
        }
        show_snackbar('جواب خاطئ', error, '💔')
      }
    }

  }
  function next_question(right_index) {
    score++;
    progress_score++;
    wrong_asnwer = false;
    if (score == info.questionlist.length - 1) {
      $('Footer > #swipe_next').set({ text: 'لقد انتهينا اسحب لليمين ⏩', textColor: success, font: 'bold 20px dubai', layoutData: 'center' });

    }
    if (score == info.questionlist.length) {
      show_result();
    } else {
      $(ProgressBar).set({ selection: progress_score });
      $(Question).set({ text: info.questionlist[score].question });
      $(Question).set({ opacity: 0.0, transform: { translationX: 32 } })
      $(Question).animate(
        { opacity: 1.0, transform: { translationX: 0 } },
        { duration: 500, delay: 0, easing: 'ease-out' });


      $('Choices > Composite > #a1').set({ text: info.questionlist[score].choices[0] });
      $('Choices > Composite > #a2').set({ text: info.questionlist[score].choices[1] });
      $('Choices > Composite > #a3').set({ text: info.questionlist[score].choices[2] });
      $('Choices > Composite > #a4').set({ text: info.questionlist[score].choices[3] });
      $(`Choices > Composite`).set({ background: '#D7D8D2' });
      $('Footer > #swipe_next').set({ visible: false });
      $('Footer > #explain').set({ visible: false });

      $(ProgressBar).set({ state: "normal" });

      $(BottomSheet).animate({ opacity: 0, transform: { translationY: +100 } }, { delay: 0, duration: 500, easing: "linear" })
    }
  }
  function show_snackbar(text, color, icon) {
    $('Snackbar > #text').set({ text: text });
    $(Snackbar).set({ background: color })
    $('Snackbar > #icon').set({ text: icon });
    $(Snackbar).set({ visible: true, transform: { translationY: 100 } });
    $(Snackbar).animate({ opacity: 1.0, transform: { translationX: 0 } }, { duration: 500, easing: 'ease-out' });
    setTimeout(() => {
      $(Snackbar).animate({ opacity: 1.0, transform: { translationY: 100 } }, { duration: 500, easing: 'linear' });
    }, 1500);
  }
  function show_BottomSheet() {
    $('BottomSheet > #explain').set({ text: info.questionlist[score].qexplain });
    $(BottomSheet).set({ visible: true, transform: { translationY: 500 } });
    $(BottomSheet).animate({
      opacity: 1.0,
      transform: { translationY: 0 }
    }, {
      delay: 0,
      duration: 500,
      easing: 'ease-out'
    });
  }
  function goBack() {
    score = 0;
    progress_score = 1
    wrong_asnwer = false;
    let nav = $('NavigationView > #exam');
    nav.dispose()
    $('Home  > Stack > Toolbar > Composite > #achive').set({ text: cal_achivement() });
  }
  function show_result() {
    let length = info.questionlist.length;
    let right = length - user_score;
    let ratio = Math.round((100 * right) / length);
    let output = `لديك ${user_score} سؤال خاطئ من أصل ${length} سؤال`;
    if (user_score == 0) {
      output = '🎉🎉 مبارك جميع الأسئلة صحيحة'
    }
    let avarage = info.Accuracy;
    avarage.push(ratio);
    let new_avarage = Math.round(mean(avarage));

    info.avarageAcc = new_avarage;
    info.numOfQuiz++;

    let balsam;
    if (ratio < 10) { balsam = repeat('😫', 3) }
    else if (ratio < 20) { balsam = repeat('😞', 3) }
    else if (ratio < 30) { balsam = repeat('😣', 3) }
    else if (ratio < 40) { balsam = repeat('😭', 3) }
    else if (ratio < 50) { balsam = repeat('😔', 3) }
    else if (ratio < 60) { balsam = repeat('😰', 3) }
    else if (ratio < 70) { balsam = repeat('🙂', 3) }
    else if (ratio < 80) { balsam = repeat('😄', 3) }
    else if (ratio < 90) { balsam = repeat('🤩', 3) }
    else if (ratio < 100) { balsam = repeat('😎', 3) }

    const popoer = Popover.open(
      <Popover>
        <Stack centerY stretchX spacing={10} padding={16}>
          <Composite background={secondary} stretchX padding={16} cornerRadius={16}>
            <TextView right font='45px' text='🎯' />
            <TextView right='prev() 10' markupEnabled  >
              <span font='20px dubai'>مستوى دقتك:</span> <br />
              <span font='40px'>{`${ratio}%`}</span>
            </TextView>
            <TextView visible={user_score == 0 ? false : true} right='95%' font='bold 16px dubai' top='prev() 10' textColor={user_score == 0 ? success : error} text={output} />
          </Composite>
          <Composite background={secondary} stretchX padding={16} cornerRadius={16}>
            <TextView centerY right markupEnabled >
              <span font='16px dubai'>متوسط الدقة 🌟</span><br />
              <span font='bold 20px dubai'> {info.subject}  </span>
            </TextView>
            <TextView left centerY font='bold 35px' text={`${new_avarage}%`} />
          </Composite>
          <TextView font='20px dubai' centerX text={balsam} />
        </Stack>
      </Popover>
    )


    app.onBackNavigation((event) => {
      popoer.close()
      goBack();
      write();
    })
  }

  return (
    <Page id='exam'
      onSwipeRight={() => { if (wrong_asnwer) { next_question() } }}
      onSwipeUp={() => { if (wrong_asnwer && info.questionlist[score].qexplain.length > 3) { show_BottomSheet() } }}
      onSwipeDown={() => $(BottomSheet).animate({ opacity: 0, transform: { translationY: +100 } }, { delay: 0, duration: 500, easing: "linear" })}
    >
      <ProgressBar tintColor={success} selection={progress_score} stretchX top maximum={info.questionlist.length} />
      <Stack top={30} stretchX padding={16} spacing={10}>
        <TextView right markupEnabled font='bold 15px dubai' textColor='#455A64'>
          <span>{info.subject}</span> / <span>{info.title}</span>
        </TextView>
        <Question />
        <Choices />
      </Stack>
      <Footer />
      <Snackbar />
      <BottomSheet />
    </Page>
  )
}

function go_to_exam(file) {
  let nav = $(NavigationView).only();
  nav.append(<Exam data={file} />)
}

function go_to_active(file) {
  let nav = $(NavigationView).only();
  nav.append(<Activate />)
}

function Activate() {
  let Paid = () => {
    let output = [];

    paid.filter(file => file.paid == true).forEach(file => {
      output.push(
        <Composite stretchX background='#D7D8D2' cornerRadius={15} padding={16} >
          <TextView right text={file.subject} font='bold 20px dubai' />
          <TextView left text={file.ID} font='bold 20px dubai' onTap={() => { share(file) }} />
          <TextInput keyboard='number' stretch top='prev() 15' message='أدخل المفتاح' style='underline' onAccept={(ev) => handle_accept(ev, file.ID, file.code)} />
        </Composite>
      )
    })

    return (<ScrollView top='10' stretch direction='vertical' scrollbarVisible={false}>
      <Stack spacing={15} stretchX alignment='stretchX' right >
        {output}
      </Stack>
    </ScrollView>);
  }
  let Snackbar = () => {
    return (
      <Composite right={10} left={10} visible={false} stretchX padding={10} cornerRadius={3} background='#048243' bottom={16} elevation={5}>
        <TextView id='text' right text='notification' font='bold 16px dubai' />
        <TextView id='icon' left text='✅' font='bold 16px dubai' />
      </Composite>
    )
  }
  function handle_accept(ev, ID, CODE) {
    let dehash = hash.decode(`${ID}`).toString();
    if (dehash.length > 0) {
      if (ev.text == dehash) {
        let index = findIndex(paid, (o) => o.code == CODE);
        paid[index].paid = false;
        secureStorage.setItem('paid', JSON.stringify(paid))
        // activate all the local files:
        db.filter(file => file.code == CODE).forEach(f => f.paid = false);
        write()
        show_snackbar('تم التفعيل بنجاح', success, '😃');
        // go_home()
      } else {
        show_snackbar('المفتاح غير مناسب', error, '😐')
      }
    }
  }
  function show_snackbar(text, color, icon) {
    $('Snackbar > #text').set({ text: text });
    $(Snackbar).set({ background: color })
    $('Snackbar > #icon').set({ text: icon });
    $(Snackbar).set({ visible: true, transform: { translationY: 100 } });
    $(Snackbar).animate({ opacity: 1.0, transform: { translationX: 0 } }, { duration: 500, easing: 'ease-out' });
    setTimeout(() => {
      $(Snackbar).animate({ opacity: 1.0, transform: { translationY: 100 } }, { duration: 500, easing: 'linear' });
    }, 1500);
  }
  function share(file) {
    app.share({
      title: 'أرسل الرمز للمطوّر',
      text: `الرمز الخاص بي لتفعيل مادة [${file.subject}]:
       ${file.ID}`
    }).catch((error) => {
      show_snackbar('لم تتم مشاركة الرمز', warrning, '😟')
    });
  }

  return (
    <Page id='activate'>
      <Stack stretchX stretchY right={15} left={15} top={15} bottom={15} spacing={10}>
        <TextView right text='قائمة تفعيل الملفات' font='bold 21px dubai' />
        <TextView font='14px dubai' markupEnabled right={1} left={0} bottom={1}>
          <span>لتفعيل بنك مدفوع لبلسم نتبع الخطوات التالية:</span> <br />
          <span>1️⃣ اشتر من فضلك كود التفعيل من المكتبة المعتمدة</span> <br />
          <span>2️⃣ ارسل رمز المادة والكود الذي اشتريته للمطور عن طريق الضغط على الرمز يسار المادة Balsam_dev@</span> <br />
          <span>3️⃣ سنرسل لك مفتاح التفعيل بأسرع وقت ممكن 😌</span> <br />
        </TextView>
        <Paid />
      </Stack>
      <Snackbar />
    </Page>
  )
}
function cal_achivement() {
  let num_total = [];
  let num_solved = [];
  let all = db.forEach(file => num_total.push(file.questionlist.length));
  let solved = db.filter(file => file.numOfQuiz > 0).forEach(file => num_solved.push(file.questionlist.length));
  return Math.round((100 * sum(num_solved)) / sum(num_total))
}