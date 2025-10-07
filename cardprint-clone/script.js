/* Multi-step UI with OTP demo and PDF slip generation */
const app = document.getElementById("app");

const state = {
  step: 1,
  aliasNumber: "",
  phone: "",
  otp: "",
  deliveryMethod: "Pickup",
  center: "Addis Ababa - HQ"
};

function render(){
  app.innerHTML = header() + body();
  bind();
}

function header(){
  return (
    '<div class="card">' +
      '<div class="card-header">' +
        '<img src="https://id.gov.et/static/eth_fayda.jpg" alt="logo"/>' +
        '<div class="title">National ID - Card Print</div>' +
      '</div>' +
      '<div class="card-body">' + steps() + content() + '</div>' +
    '</div>'
  );
}

function steps(){
  const items = [
    {n:1, t:"Enter Alias & Phone"},
    {n:2, t:"Verify OTP"},
    {n:3, t:"Confirm Details"},
    {n:4, t:"Payment & Slip"}
  ];
  return '<div class="steps">' + items.map(i=>
    '<div class="step ' + (state.step===i.n?'active':'') + '">' + i.n + '. ' + i.t + '</div>'
  ).join("") + '</div>';
}

function body(){
  return '';
}

function content(){
  if(state.step===1){
    return (
      '<div class="form-grid">' +
        '<div class="form-row">' +
          '<label class="label">Fayda Alias Number</label>' +
          '<input class="input" id="alias" placeholder="e.g. 1234-5678-9012" value="' + (state.aliasNumber||"") + '"/>' +
        '</div>' +
        '<div class="form-row">' +
          '<label class="label">Phone Number</label>' +
          '<input class="input" id="phone" placeholder="e.g. 0912345678" value="' + (state.phone||"") + '"/>' +
        '</div>' +
      '</div>' +
      '<div class="note">We will send an OTP to your phone to verify your identity.</div>' +
      '<div class="actions">' +
        '<button class="btn primary" id="next1">Send OTP</button>' +
      '</div>'
    );
  }
  if(state.step===2){
    return (
      '<div class="form-row">' +
        '<label class="label">Enter OTP</label>' +
        '<div class="otp-row">' +
          Array.from({length:6}).map((_,i)=>'<input maxlength="1" class="otp-input" id="otp-' + i + '"/>').join("") +
        '</div>' +
        '<div class="note">A 6-digit code was sent to ' + (state.phone || 'your phone') + '.</div>' +
      '</div>' +
      '<div class="actions">' +
        '<button class="btn" id="back2">Back</button>' +
        '<button class="btn primary" id="next2">Verify</button>' +
      '</div>'
    );
  }
  if(state.step===3){
    return (
      '<div class="summary">' +
        '<div class="item"><div class="key">Alias Number</div><div class="value">' + (state.aliasNumber||'-') + '</div></div>' +
        '<div class="item"><div class="key">Phone</div><div class="value">' + (state.phone||'-') + '</div></div>' +
        '<div class="item"><div class="key">Delivery Method</div><div class="value">' + state.deliveryMethod + '</div></div>' +
        '<div class="item"><div class="key">Pickup Center</div><div class="value">' + state.center + '</div></div>' +
      '</div>' +
      '<div class="divider"></div>' +
      '<div class="form-grid">' +
        '<div class="form-row">' +
          '<label class="label">Delivery Method</label>' +
          '<select class="select" id="method">' +
            '<option>Pickup</option>' +
            '<option>Courier</option>' +
          '</select>' +
        '</div>' +
        '<div class="form-row">' +
          '<label class="label">Pickup Center</label>' +
          '<select class="select" id="center">' +
            '<option>Addis Ababa - HQ</option>' +
            '<option>Adama - Center</option>' +
            '<option>Hawassa - Center</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div class="actions">' +
        '<button class="btn" id="back3">Back</button>' +
        '<button class="btn primary" id="next3">Continue</button>' +
      '</div>'
    );
  }
  return (
    '<div class="form-row">' +
      '<div class="note">Review and generate your payment slip. This is a demo; no real payment is processed.</div>' +
    '</div>' +
    '<div class="actions">' +
      '<button class="btn" id="back4">Back</button>' +
      '<button class="btn primary" id="generate">Generate Slip (PDF)</button>' +
    '</div>'
  );
}

function bind(){
  if(state.step===1){
    document.getElementById('alias').addEventListener('input', e=> state.aliasNumber = e.target.value);
    document.getElementById('phone').addEventListener('input', e=> state.phone = e.target.value);
    document.getElementById('next1').addEventListener('click', ()=>{
      if(!state.aliasNumber || !state.phone){ alert('Enter alias and phone'); return; }
      state.step = 2; render();
      const boxes = Array.from(document.querySelectorAll('.otp-input'));
      if(boxes[0]) boxes[0].focus();
      boxes.forEach((b,i)=>{
        b.addEventListener('input', e=>{
          if(e.target.value && i<boxes.length-1) boxes[i+1].focus();
        });
      });
    });
    return;
  }
  if(state.step===2){
    document.getElementById('back2').addEventListener('click', ()=>{ state.step=1; render(); });
    document.getElementById('next2').addEventListener('click', ()=>{
      const code = Array.from(document.querySelectorAll('.otp-input')).map(i=>i.value).join('');
      if(code.length!==6){ alert('Enter 6-digit OTP'); return; }
      state.otp = code; state.step = 3; render();
    });
    return;
  }
  if(state.step===3){
    document.getElementById('back3').addEventListener('click', ()=>{ state.step=2; render(); });
    document.getElementById('method').value = state.deliveryMethod;
    document.getElementById('center').value = state.center;
    document.getElementById('method').addEventListener('change', e=> state.deliveryMethod = e.target.value);
    document.getElementById('center').addEventListener('change', e=> state.center = e.target.value);
    document.getElementById('next3').addEventListener('click', ()=>{ state.step=4; render(); });
    return;
  }
  document.getElementById('back4').addEventListener('click', ()=>{ state.step=3; render(); });
  document.getElementById('generate').addEventListener('click', generatePdf);
}

async function generatePdf(){
  const { PDFDocument, StandardFonts, rgb } = window.pdfLib;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 396]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const draw = (text, x, y, size=12)=>{
    page.drawText(text, { x, y, size, font, color: rgb(0.1,0.1,0.1) });
  };

  page.drawRectangle({ x: 24, y: 24, width: 612-48, height: 396-48, borderColor: rgb(0.2,0.4,0.7), borderWidth: 1 });
  draw('National ID - Card Print Slip', 32, 350, 18);
  draw('Alias Number: ' + (state.aliasNumber||'-'), 32, 320, 12);
  draw('Phone: ' + (state.phone||'-'), 32, 300, 12);
  draw('Delivery Method: ' + state.deliveryMethod, 32, 280, 12);
  draw('Pickup Center: ' + state.center, 32, 260, 12);
  draw('OTP Verified: ' + (state.otp? 'Yes' : 'No'), 32, 240, 12);
  draw('This slip is generated for demo purposes only.', 32, 210, 10);

  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'card-print-slip.pdf'; a.click();
  URL.revokeObjectURL(url);
}

render();

