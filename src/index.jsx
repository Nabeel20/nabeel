import { contentView, app, device, ProgressBar, Row, fs, ScrollView, NavigationView, Page, Popover, statusBar, navigationBar, AlertDialog, Stack, TextView, Button, Composite } from 'tabris';
import * as _ from "lodash";
import * as crypto from "crypto-js"
// * app autoload 
tabris.app.idleTimeoutEnabled = false;
//* theme 
statusBar.background = '#333431'
statusBar.theme = 'dark'
navigationBar.background = '#333431';
navigationBar.theme = 'dark'
//* Colors 
const success = '#14A38B'
const error = '#FF7171'
const warrning = '#F2AC57'
const brand = '#333431'
app.onForeground(() => console.log('app is ON'));
//! Dubai or dubaik
app.registerFont('dubai', 'resoruces/DUBAI.TTF');
//* DB 
let queestion_db = [
  {
    title: 'اختبار',
    subject: 'تشريح',
    questionlist: [{ question: 'لماذا يرمز مجين الفيروسات عدداً قليلاً من البروتينات؟', right: 'المساعدة في عملية التضاعف الفيروسي', choices: ['المساعدة في عملية التضاعف الفيروسي', 'تَسهيل نقل الحمض النووي الفيروسي من خلية ثوي إلى أخرى', 'حماية مجين الفيروس من التعطيل بواسطة أنزيم النوكلياز ', 'تؤّمن التناظر البنيوي لجسيم الفيروس'] }],
    cycle: '2020'
  }
]
let score = 0;
let progress_score = 1;
let wrong_asnwer = false;

contentView.append(
  <$>
    <NavigationView stretch toolbarVisible={false}>
      <Router view='main' data={queestion_db} />
    </NavigationView>
  </$>
);
auto_subjects_array();
auto_file_list();

//* Router
function Router(route) {
  let View = null;
  if (route.view == 'main') { }
  View = main_page();
  if (route.view == 'exam') {
    View = exam_page(route.data);
  }
  return View
}
function navigation(route, data) {
  $(NavigationView).only().append(<Router view={`${route}`} data={data} />);
}
function auto_subjects_array() {
  let row = $(Row).only();
  let subjects = [...new Set(_.map(queestion_db, 'subject'))];
  subjects.forEach(file => row.append(SubjectArray(file)))
}
function auto_file_list() {
  const main = $(Composite).first('#main');
  queestion_db.forEach(file => main.append(handle_file(file)));
}
function SubjectArray(data) {
  let underscore = _.replace(data, ' ', '_');
  let output = _.padStart(underscore, underscore.length + 1, '#');
  return (
    <Composite highlightOnTouch background='#333431' cornerRadius={16} onTap={() => filter_subjects(output)} padding={10}>
      <TextView text={output} textColor='white' markupEnabled font='15px dubai' />
    </Composite>
  )
}
function filter_subjects(data) {
  const main = $(Composite).first('#main');
  let underscore = _.replace(data, '_', ' ');
  let subject = underscore.split('');
  subject.shift();
  let filtred_subject = queestion_db.filter(file => file.subject == subject.join(''));
  main.children().dispose();
  filtred_subject.forEach(file => main.append(handle_file(file)));
}
function Snackbar() {
  return (
    <Composite right={10} left={10} visible={false} stretchX padding={10} cornerRadius={3} background='#048243' bottom={16} elevation={5}>
      <TextView id='text' right textColor='white' text='notification' font='bold 16px dubai' />
      <TextView id='icon' left text='✅' font='bold 16px dubai' />
    </Composite>
  )
}
function AddButton() {
  return (
    <Composite centerX padding={14} cornerRadius={30} background='#333431' bottom={32} elevation={10} highlightOnTouch onTap={add_file}>
      <TextView id='text' textColor='white' text='إضــافة ملــف +' font='bold 16px dubai' />
    </Composite>)
}
function snackbar_logic(info, color, icon) {
  $(Snackbar).children(TextView).first().set({ text: info })
  $(Snackbar).first(Composite).set({ background: color })
  $(Snackbar).children(TextView).last().set({ text: icon })

  let snack = $('Router > Snackbar');
  snack.set({ visible: true, transform: { translationY: 100 } })
  snack.animate({
    opacity: 1.0,
    transform: { translationX: 0 }
  }, {
    delay: 0,
    duration: 500,
    easing: 'ease-out'
  });
  setTimeout(() => {
    snack.animate({
      opacity: 0,
      transform: { translationY: +100 }
    }, {
      delay: 0,
      duration: 500,
      easing: "linear"
    });
  }, 1500);
}
async function add_file() {
  try {
    const main = $(Composite).first('#main');
    const row = $(Row).only();
    let file = await fs.openFile({ type: 'text/plain', quantity: 'single' });
    let file_buffer = await file[0].arrayBuffer();
    let file_string = String.fromCharCode.apply(null, new Uint8Array(file_buffer));
    let en = crypto.AES.decrypt(file_string, "nabeel adnan ali nizam");
    let de = JSON.parse(en.toString(crypto.enc.Utf8));
    if (!queestion_db.some(file => file.title == de.title)) {
      queestion_db.unshift(de);
      main.children().dispose();
      auto_file_list();
      row.children().dispose();
      auto_subjects_array();
      snackbar_logic('تمت الإضافة بنجاح', success, '😃')
    } else {
      snackbar_logic('الملف موجود سلفاً ', warrning, '😕')
    }
  } catch (error) {
    snackbar_logic('لم يتم اختيار ملف', warrning, '😕')
  }
}


//* Main Page
function main_page() {
  return (
    <Page background='#fffffe'>
      <Stack stretchX stretchY right={15} left={15} top={15} bottom={5} spacing={10}>
        <Composite stretchX >
          <TextView right centerY markupEnabled font='bold 25px dubai' text='بلسم' />
          <TextView right='prev() 5' centerY markupEnabled font='bold 16px dubai' text='💊' />

          <TextView centerY font='bold 14px dubai' >الإحصائيات هنا</TextView>
          {/* <Button bottom left text='إضافة ملف +' background='#333431' font=' bold 16px dubai' textColor='white' style='flat' onSelect={add_file} /> */}
        </Composite>

        <TextView text='المقررات:' font='16px dubai' right />
        <ScrollView top='2' stretchX direction='horizontal' scrollbarVisible={false} right >
          <Row id='subjcet' spacing={10} alignment='stretchX' right>
          </Row>
        </ScrollView>

        <ScrollView top='10' stretch direction='vertical' scrollbarVisible={false}>
          <Stack id='main' spacing={15} stretchX alignment='stretchX' right />
        </ScrollView>
      </Stack>
      <Snackbar />
      <AddButton />
    </Page>
  )
}
function Icon(data) {
  let subject = data.subject;
  let output = null;
  if (subject == 'تشريح') {
    output = '🔥'
  }
  if (subject == 'مهارات سريرية') {
    output = '👽'
  }
  return (<TextView font='25px' right text={output} />)
}
function handle_file(data) {
  let title = data.title;
  let subject = data.subject;
  let length = data.questionlist.length;
  let accuracy = data.avarageAcc;
  let time = data.avarageTime;
  let num = data.numOfQuiz;
  let paid = data.paid;
  let cycle = data.cycle;

  return (
    <Composite onTap={() => {
      const popover = Popover.open(
        <Popover>
          <Stack centerY stretchX onSwipeDown={() => popover.close()} spacing={10} padding={16}>
            <Stack stretchX>
              <Button font='bold 14px  dubai' style='flat' background={error} text='حذف الملف' textColor='white' />
              <Composite background='#333431' stretchX padding={20} cornerRadius={16}>
                <TextView right text={title} textColor='white' font='bold 22px dubai' />
                <TextView right top='prev() 1' textColor='white' text={subject} font='20px dubai' />
              </Composite>
            </Stack>


            <Composite stretchX >
              <Composite left='48%' right={0} background='#F4D7D7' padding={16} cornerRadius={16}>
                <TextView right text='💯' font='bold 20px dubai' />
                <TextView right='prev() 3' text='متوسط الدقة' font='bold 20px dubai' />
                <TextView top='prev() 2' centerX text={accuracy} font='20px dubai' />
              </Composite>
              <Composite left right='48%' background='#FDDC5C' padding={16} cornerRadius={16}>
                <TextView right text='⏳' font='bold 20px dubai' />
                <TextView right='prev() 3' text='متوسط الوقت' font='bold 20px dubai' />
                <TextView top='prev() 2' centerX text={time} font='20px dubai' />
              </Composite>
            </Composite>

            <Composite stretchX >
              <Composite left='48%' right={0} background='#7BC8F6' padding={16} cornerRadius={16}>
                <TextView right text='📄' font='bold 20px dubai' />
                <TextView right='prev() 3' text='عدد الأسئلة' font='bold 20px dubai' />
                <TextView top='prev() 2' centerX text={length} font='20px dubai' />
              </Composite>
              <Composite left right='48%' background='#CFFDBC' padding={16} cornerRadius={16}>
                <TextView right text='⚡️' font='bold 20px dubai' />
                <TextView right='prev() 3' text='عدد مرات' font='bold 20px dubai' />
                <TextView top='prev() 2' centerX text={time} font='20px dubai' />
              </Composite>
            </Composite>


            <Composite stretchX padding={20} cornerRadius={16} highlightOnTouch background={paid ? error : success} onTap={() => { navigation('exam', data), popover.close() }}>
              <TextView centerX centerY text='خوض الامتحان' font='bold 20px dubai' />
            </Composite>
          </Stack>
        </Popover>
      );
    }} highlightOnTouch background='#D7D8D2' cornerRadius={15} padding={16} height='100'>
      <Icon subject={subject} />
      <TextView font='bold 22px dubai ' right='prev() 10' text={title} />
      <Composite id='cool' cornerRadius={15} width='30' height='30' background='#333431'>
        <TextView font='16px dubai' centerY centerX textColor='white' text={length} />
      </Composite>
      <TextView font='16px dubai' right='88%' top='prev() 3' text={subject} />
      <TextView visible={cycle.length > 3 ? true : false} font='16px dubai' left top='#cool 10' textColor='#FD4659' text={`دورة ${cycle}`} />
    </Composite>
  )
}

function Exam_Snackbar() {
  return (
    <Composite right={10} left={10} visible={false} stretchX padding={10} cornerRadius={3} background='#048243' bottom={16} elevation={5}>
      <TextView id='text' right textColor='white' text='notification' font='bold 16px dubai' />
      <TextView id='icon' left text='✅' font='bold 16px dubai' />
    </Composite>
  )
}
function exam_snackbar(info, color, icon) {
  $(Exam_Snackbar).children(TextView).first().set({ text: info })
  $(Exam_Snackbar).first(Composite).set({ background: color })
  $(Exam_Snackbar).children(TextView).last().set({ text: icon })

  let snack = $(Exam_Snackbar).only();
  snack.set({ visible: true, transform: { translationY: 100 } })
  snack.animate({
    opacity: 1.0,
    transform: { translationX: 0 }
  }, {
    delay: 0,
    duration: 500,
    easing: 'ease-out'
  });
  setTimeout(() => {
    snack.animate({
      opacity: 0,
      transform: { translationY: +100 }
    }, {
      delay: 0,
      duration: 500,
      easing: "linear"
    });
  }, 1500);
}




//* Exam Page
function exam_page(data) {
  let title = data.title
  let subject = data.subject;
  _.shuffle(data.questionlist);
  data.questionlist.forEach(q => _.shuffle(q.choices))
  let all_questions = data.questionlist[score];
  return (
    <Page>
      <ProgressBar right tintColor={brand} selection={progress_score} stretchX top maximum={data.questionlist.length} />
      <Stack stretchY stretchX padding={16} spacing={10}>
        <TextView right markupEnabled font='15px dubai' textColor='#455A64'>
          <span>{subject}</span> / <span>{title}</span>
        </TextView>
        <TextView id='question' left={1} right={1} top={1} font='bold 24px dubai' > {all_questions.question}</TextView>



        <Stack stretchX spacing={16}>
          <Composite id='b0' left={1} right={1} background='#D7D8D2' cornerRadius={5} padding={10} highlightOnTouch onTap={() => check(data, all_questions.choices[0])}>
            <TextView id='a1' left={1} right={1} top={1} right text={all_questions.choices[0]} font='bold 16px dubai' />
          </Composite>
          <Composite id='b1' left={1} right={1} background='#D7D8D2' cornerRadius={5} padding={10} highlightOnTouch onTap={() => check(data, all_questions.choices[1])}>
            <TextView id='a2' left={1} right={1} top={1} right text={all_questions.choices[1]} font='bold 16px dubai' />
          </Composite>
          <Composite id='b2' left={1} right={1} background='#D7D8D2' cornerRadius={5} padding={10} highlightOnTouch onTap={() => check(data, all_questions.choices[2])}>
            <TextView id='a3' left={1} right={1} top={1} right text={all_questions.choices[2]} font='bold 16px dubai' />
          </Composite>
          <Composite id='b3' left={1} right={1} background='#D7D8D2' cornerRadius={5} padding={10} highlightOnTouch onTap={() => check(data, all_questions.choices[3])}>
            <TextView id='a4' left={1} right={1} top={1} right text={all_questions.choices[3]} font='bold 16px dubai' />
          </Composite>
        </Stack>



        <Button text='شرح السؤال' bottom right font='bold 16px dubai' />
        <Button text='التالي' bottom left font='bold 16px dubai' onSelect={() => next_question(data)} />
      </Stack>
      <Exam_Snackbar />
    </Page >
  )
}


function check(data, answer) {
  let right = data.questionlist[score].right;
  let right_index = data.questionlist[score].choices.indexOf(right);
  let selector = '#b' + right_index
  if (_.isEqual(right, answer)) {
    exam_snackbar('جواب صحيح', success, '😎')
    next_question(data);
  } else {
    wrong_asnwer = true;
    $(`Router > Stack > Stack > ${selector}`).set({ background: success });
    exam_snackbar('جواب خاطئ', error, '💔')
  }


}
function next_question(data) {
  let right = data.questionlist[score].right;
  let right_index = data.questionlist[score].choices.indexOf(right);
  wrong_asnwer = false
  score++;
  progress_score++;
  $('Router > ProgressBar').set({ selection: progress_score });
  $('Router > Stack > #question').set({ text: data.questionlist[score].question });
  $('Router > Stack > Stack > Composite > #a1').set({ text: data.questionlist[score].choices[0] });
  $('Router > Stack > Stack > Composite > #a2').set({ text: data.questionlist[score].choices[1] });
  $('Router > Stack > Stack > Composite > #a3').set({ text: data.questionlist[score].choices[2] });
  $('Router > Stack > Stack > Composite > #a4').set({ text: data.questionlist[score].choices[3] });
  $(`Router > Stack > Stack > #b${right_index}`).set({ background: '#D7D8D2' });
}
