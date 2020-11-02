import { contentView, app, fs, TextView, Popover, NavigationView, ProgressBar, Page, Button, Stack, ScrollView, Composite, Row, navigationBar } from 'tabris';
import * as _ from "lodash";
import * as crypto from "crypto-js"
// * app autoload 
app.idleTimeoutEnabled = false;
const database_path = fs.filesDir + '/database.txt';

app.onForeground(() => {
  console.log('Balsam is ON');
});


app.registerFont('dubai', 'resoruces/Cairo.TTF');
const success = '#14A38B'
const error = '#FF7171'
const warrning = '#F2AC57'
const brand = '#333431'
const font_headline = 'bold 25px dubai';
const font_body = 'bold 20px dubai '







let score = 0;
let progress_score = 1;
let wrong_asnwer = false;
let index = null;
let db = [
  {
    title: 'اختبار',
    subject: 'تشريح', numOfQuiz: 0,
    questionlist: [
      { question: 'لماذا يرمز مجين الفيروسات عدداً قليلاً من البروتينات؟', qexplain: 'التفسير لا ينبغي أن يكون طويلاً لهذه الدرجة ولكن كتجربة يمكننا الاعتماد على هذا', right: 'المساعدة في عملية التضاعف الفيروسي', choices: ['المساعدة في عملية التضاعف الفيروسي', 'تَسهيل نقل الحمض النووي الفيروسي من خلية ثوي إلى أخرى', 'حماية مجين الفيروس من التعطيل بواسطة أنزيم النوكلياز ', 'تؤّمن التناظر البنيوي لجسيم الفيروس'] },
      { question: 'ما الرقم الأكبر', qexplain: '', right: '4', choices: ['1', '2', '3', '4'] },
      { question: 'ما الرقم الأصغر', qexplain: '', right: '1', choices: ['1', '2', '3', '4'] }],
    cycle: '2020'
  },
  {
    title: 'اختبار',
    subject: 'بطاطا',
    questionlist: [{ question: 'لماذا يرمز مجين الفيروسات عدداً قليلاً من البروتينات؟', right: 'المساعدة في عملية التضاعف الفيروسي', choices: ['المساعدة في عملية التضاعف الفيروسي', 'تَسهيل نقل الحمض النووي الفيروسي من خلية ثوي إلى أخرى', 'حماية مجين الفيروس من التعطيل بواسطة أنزيم النوكلياز ', 'تؤّمن التناظر البنيوي لجسيم الفيروس'] }],
    cycle: '2020'
  }
]
contentView.append(
  <$>
    <NavigationView stretch toolbarVisible={false}>
      <Home />
    </NavigationView>
  </$>
);

function Home() {
  let Toolbar = () => {
    return (
      <Composite stretchX >
        <TextView right centerY markupEnabled font='bold 25px dubai' text='بلسم' />
        <TextView right='prev() 5' centerY markupEnabled font='bold 16px dubai' text='💊' />

        <TextView centerY font='bold 14px dubai' >الإحصائيات هنا</TextView>
      </Composite>
    )
  }
  let Subjects = () => {
    let subjects = [...new Set(_.map(db, 'subject'))];
    let output = []
    subjects.forEach(subject => {
      output.push(handle_subjects(subject))
    })
    return (
      <ScrollView top='2' stretchX direction='horizontal' scrollbarVisible={false} right >
        <Row id='subjcet' spacing={10} alignment='stretchX' right>
          {output}
        </Row>
      </ScrollView>
    )
  }
  let Files = () => {
    let database = db;
    let output = []
    db.forEach(file => {
      output.push(
        handle_files(file)
      )
    })

    return (
      <ScrollView top='10' stretch direction='vertical' scrollbarVisible={false}>
        <Stack id='main' spacing={15} stretchX alignment='stretchX' right >
          {output}
        </Stack>
      </ScrollView>
    )
  }
  let Add = () => {
    return (
      <Composite centerX padding={14} cornerRadius={30} background='#333431' bottom={32} elevation={10} highlightOnTouch onTap={() => add_file()} >
        <TextView id='text' textColor='white' text='إضــافة ملــف +' font='bold 16px dubai' />
      </Composite>)
  }
  let Snackbar = () => {
    return (
      <Composite right={10} left={10} visible={false} stretchX padding={10} cornerRadius={3} background='#048243' bottom={16} elevation={5}>
        <TextView id='text' right textColor='white' text='notification' font='bold 16px dubai' />
        <TextView id='icon' left text='✅' font='bold 16px dubai' />
      </Composite>
    )
  }
  let Exam_info = (file) => {
    let info = file.data;
    return (
      <Popover>
        <Stack centerY stretchX spacing={10} padding={16}>
          <Stack stretchX>
            <Button font='bold 14px  dubai' style='flat' background={error} text='حذف الملف' textColor='white' />
            <Composite background='#333431' stretchX padding={20} cornerRadius={16}>
              <TextView right text={info.title} textColor='white' font='bold 22px dubai' />
              <TextView right top='prev() 1' textColor='white' text={info.subject} font='20px dubai' />
            </Composite>
          </Stack>


          <Composite stretchX background='#F4D7D7' padding={16} cornerRadius={16}>
            <TextView right text='💯' font='bold 20px dubai' />
            <TextView right='prev() 3' text='متوسط الدقة' font='bold 20px dubai' />
            <TextView left='3' text={info.accuracy} font='20px dubai' />
          </Composite>

          <Composite stretchX >
            <Composite left='48%' right={0} background='#7BC8F6' padding={16} cornerRadius={16}>
              <TextView right text='📄' font='bold 20px dubai' />
              <TextView right='prev() 3' text='عدد الأسئلة' font='bold 20px dubai' />
              <TextView top='prev() 2' centerX text={info.questionlist.length} font='20px dubai' />
            </Composite>
            <Composite left right='48%' background='#CFFDBC' padding={16} cornerRadius={16}>
              <TextView right text='⚡️' font='bold 20px dubai' />
              <TextView right='prev() 3' text='عدد مرات' font='bold 20px dubai' />
              <TextView top='prev() 2' centerX text={info.numOfQuiz} font='20px dubai' />
            </Composite>
          </Composite>


          <Composite stretchX padding={20} cornerRadius={16} highlightOnTouch background={info.paid ? error : success} onTap={() => { go_to_exam() }}>
            <TextView centerX centerY text='خوض الامتحان' font='bold 20px dubai' />
          </Composite>
        </Stack>
      </Popover>
    )
  }


  function Icon(file) {
    let data = file.subject;
    let output;
    switch (data.subject) {
      case 'تشريح':
        output = '🔥'
        break;
      case 'بطاطا':
        output = '🥔'
        break;
      default:
        output = '📕'
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
                <Button font='bold 14px  dubai' style='flat' background={error} text='حذف الملف' textColor='white' />
                <Composite background='#333431' stretchX padding={16} cornerRadius={16}>
                  <TextView right left={0} top={0} text={file.title} textColor='white' font='bold 22px dubai' />
                  <TextView right top='prev() 1' textColor='white' text={file.subject} font='16px dubai' />
                  <TextView right='prev() 10' bottom text={`دورة ${file.cycle}`} textColor={error} font='bold 16px dubai' />

                </Composite>
              </Stack>


              <Composite stretchX background='#F4D7D7' padding={16} cornerRadius={16}>
                <TextView right text='💯' font='bold 20px dubai' />
                <TextView right='prev() 3' text='متوسط الدقة' font='bold 20px dubai' />
                <TextView left='3' text='100' font='20px dubai' />
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


              <Composite stretchX padding={18} cornerRadius={16} highlightOnTouch background={file.paid ? '#4CAF50' : '#66BB6A'} onTap={() => { go_to_exam(file), popover.close() }}>
                <TextView centerX centerY text='خوض الامتحان' font='bold 20px dubai' />
              </Composite>
            </Stack>
            <TextView bottom={5} centerX text='للإغلاق اسحب للأسفل' font='15px dubai' textColor='#616161' />

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
    let underscore = _.replace(subject, ' ', '_');
    let hash_subject = _.padStart(underscore, underscore.length + 1, '#');
    return (
      <Composite highlightOnTouch background='#333431' cornerRadius={16} padding={10} onTap={() => filter_subjects(hash_subject)} >
        <TextView text={hash_subject} textColor='white' markupEnabled font='15px dubai' />
      </Composite>
    )
  }
  function filter_subjects(data) {
    let underscore = _.replace(data, '_', ' ');
    let subject = underscore.split('');
    subject.shift();
    let filtred_subject = db.filter(file => file.subject == subject.join(''));
    $('Files > Stack').only().children().dispose();
    filtred_subject.forEach(subject => { $('Files > Stack').only().append(handle_files(subject)) })
  }

  async function save() {
    if (await fs.appendToFile(database_path, JSON.stringify(db), 'utf-8')) {
      console.info(`new file was created`)
    } else {
      console.info(` file already exist`)
    }
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
        fs.removeFile(database_path)
        save(db);
        $('Files >Stack').only().children().dispose();
        db.forEach(file => $('Files >Stack').only().append(handle_files(file)));

        $('Subjects > Row').only().children().dispose();
        [...new Set(_.map(db, 'subject'))].forEach(subject => $('Subjects > Row').only().append(handle_subjects(subject)))
        show_snackbar('تمت الإضافة بنجاح', success, '😃')
      } else {
        show_snackbar('الملف موجود سلفاً ', warrning, '😕')
      }
    } catch (error) {
      show_snackbar('لم يتم اختيار ملف', warrning, '😕')
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


  return (
    <Page background='#fffffe'>
      <Stack stretchX stretchY right={15} left={15} top={15} bottom={5} spacing={10}>
        <Toolbar />
        <TextView text='المقررات:' font='16px dubai' right />
        <Subjects />
        <Files />
      </Stack>
      <Add />
      <Snackbar />
    </Page>
  )
}

function Exam(file) {
  let info = file.data

  info.questionlist = _.shuffle(info.questionlist);
  for (let q of info.questionlist) {
    q.choices = _.shuffle(q.choices)
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
        <TextView visible={false} id='explain' right text='للاطلاع على شرح السؤال اسحب للأعلى 👆' font=' 15px dubai' textColor='#455A64' />
        <TextView visible={false} id='swipe_next' right top='prev() 3' text='للانتقال للسؤال التالي اسحب باتجاه اليمين 👉' font=' 15px dubai' textColor='#455A64' />
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
        $(`Choices > #b${right_index}`).set({ background: '#00C853' });
        $('Footer > #swipe_next').set({ visible: true });
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
    wrong_asnwer = false
    try {
      let nav = $('NavigationView > #exam');
      nav.dispose();
    } catch (error) {
      console.warn(error)
    }

  }
  function show_result() {
    const popoer = Popover.open(
      <Popover >
        <TextView center text='result' />
      </Popover>
    )
    app.onBackNavigation((event) => {
      event.preventDefault();
      popoer.close()
      goBack();
    })
  }
  app.onBackNavigation(() => {
    score = 0;
    progress_score = 1
    wrong_asnwer = false
  })


  return (
    <Page id='exam'
      onSwipeRight={() => { if (wrong_asnwer) { next_question() } }}
      onSwipeUp={() => { if (wrong_asnwer && info.questionlist[score].qexplain.length > 3) { show_BottomSheet() } }}
      onSwipeDown={() => $(BottomSheet).animate({ opacity: 0, transform: { translationY: +100 } }, { delay: 0, duration: 500, easing: "linear" })}
    >
      <ProgressBar tintColor={brand} selection={progress_score} stretchX top maximum={info.questionlist.length} />
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