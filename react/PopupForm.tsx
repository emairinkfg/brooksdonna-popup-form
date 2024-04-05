//@ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import styles from './styles/style.css';

const PopupForm = () => {

  const acronym = "NW"

  //@ts-ignore
  const ref = useRef(null);
  //@ts-ignore
  const inputRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [birthDay, setBirthday] = useState(new Date())
  //@ts-ignore
  const [optin, setOptin] = useState(false)

  const [success, setSuccess] = useState(false)


  useEffect(() => {
    const isFirstVisit = localStorage.getItem('firstVisit') === null;

    (isFirstVisit) ? (setShowModal(true), localStorage.setItem('firstVisit', 'false')) : null

  }, [name, email, birthDay, optin, success]);


  const maskDateInput = (e: any) => {
    const inputValue = e?.target?.value;

    const numericValue = inputValue.replace(/\D/g, '');

    if (numericValue.length <= 2) {
      e.target.value = numericValue;
    } else if (numericValue.length <= 4) {
      e.target.value = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
    } else {
      e.target.value = `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
    }

    const newValue = e.target.value

    const arr = newValue.split("/"), day = arr[0], month = arr[1], year = arr[2], time = "00:00:00"
    const newBirthday = new Date(`${year}-${month}-${day}T${time}`)

    if (newBirthday.toString() !== "Invalid Date") {
      const birthDayString = newBirthday.toString().split(" GTM")[0]
      const birthDayFinalDate = new Date(birthDayString)

      setBirthday(birthDayFinalDate)
    }
  }

  const closeModal = () => {
    setShowModal(false);
  };

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: any) => {
    console.log("Handle Submit,", e)

    const checkbox = document.getElementById("checkNewsletterTerms") as HTMLInputElement

    if (!name || !email || !birthDay || !checkbox.checked) {

      if (!name) return alert("Digite um nome válido")
      if (!email || !isValidEmail(email)) return alert("Digite um email válido")
      if (!birthDay) return alert("Insira uma data de nascimento válida")
      if (!checkbox.checked) return alert("É obrigatório o aceite do termo de consentimento")

    }

    try {
      const request = await fetch(`/api/dataentities/${acronym}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          name,
          email,
          birthday: birthDay
        }),
      })

      const response = await request.json()
      response
      setSuccess(true)
    }

    catch (e) {
      alert("Houve um problema ao se cadastrar, por favor tente mais tarde.")
    }
  }
  return (
    <>
      {showModal && (
        <div id={"modalBackground"} className={styles.modal_overlay}>
          <div className={`${styles.modal_container} ${success ? styles.modal_container_bgWhite : null}`}>
            {(!success) && (<>
              <div className={styles.modal__left}>
                <button className={styles.modal_close__mobile} onClick={() => { closeModal() }}>
                  x
                </button>
              </div><div className={styles.modal__right}>
                <div className={styles.modal__head}>
                  <button className={styles.modal_close} onClick={() => { closeModal() }}>
                    x
                  </button>
                </div>

                <div className={styles.modal__body}>
                  <div className={styles.popup__formTitle}> Brooks Donna </div>
                  <div className={styles.popup__formGreetings}> seja bem-vinda! </div>
                  <div className={styles.popup__formText}> Cadastre-se para as novidades do momento & <strong> Ganhe 10% OFF </strong> na 1ª compra. </div>

                  <div className={styles.modal__formWrap}>
                    <input type="text" name="name" placeholder="Nome completo" className={styles.inputFullWidth} onChange={(e) => { setName(e.target.value); }} />
                    <input type="email" name="email" placeholder="E-mail" className={styles.inputFullWidth} onChange={(e) => { setEmail(e.target.value); }} />
                    <input className={`${styles.inputCalendar} ${styles.inputFullWidth}`} type='text' placeholder='Data de nascimento' onChange={(element) => { (setBirthday(element.target.valueAsDate as any), maskDateInput(element)); }} />
                    <div className={styles.optinWrapp}>
                      <input id={"checkNewsletterTerms"} className={styles.institutionalCheckbox} type="checkbox" />

                      Li e concordo com o <a className={styles.institutionalUrl} href="/institucional/politica-de-privacidade" target='_blank'> Termo de consentimento </a>
                    </div>
                    <input type="submit" onClick={(e) => { handleSubmit(e); }} className={styles.sendButton} />
                  </div>
                </div>
              </div>
            </>)}
            {success && (<>
              <div className={styles.modal__successWrapp}>
                <button className={styles.modal_close} onClick={() => { closeModal() }}>
                  x
                </button>
                <button className={styles.modal_close__mobile} onClick={() => { closeModal() }}>
                  x
                </button>
                <img src="/arquivos/success.png" alt="modelo" width={80} height={80} />
                <p className={styles.success__message}>Cadastro realizado com sucesso!</p>
                <em className={styles.modal__line}> </em>
                <div className={styles.coupon__container}>
                  <p className={styles.couponTextTitle}> Use o cupom </p>
                  <h1 className={styles.couponCode}> DONNA10 </h1>
                  <span className={styles.couponSubText}>e aproveite um estilo exclusivo com <br /><strong>10% OFF</strong> na 1° compra</span>
                  <input type='submit' className={styles.returnToSiteBtn} onClick={() => { closeModal() }} value="Ir para o site" />
                </div>
              </div>

            </>)}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupForm;
