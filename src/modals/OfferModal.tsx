import React, {useRef, forwardRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

import {useCombinedRefs} from '../utils/use-combined-refs';

export const OfferModal = forwardRef((_, ref) => {
  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const renderContent = () => [
    <View style={s.content__header} key="0">
      <Text style={s.content__heading}>Договор оферта</Text>
    </View>,
    <View style={s.content__inside} key="1">
      <Text
        style={[s.content__paragraph, {fontWeight: '700', marginVertical: 5}]}>
        1. Общие положения
      </Text>
      <Text style={s.content__paragraph}>
        1.1. Документ размещается как публичная оферта компании ООО
        «Интернетика» и определяет условия обслуживания лиц, которые
        зарегистрировались в приложении «M-Cleaning» для iOS/Android и заказали
        предлагаемые компанией ООО «Интернетика» клининговые работы.
      </Text>
      <Text style={s.content__paragraph}>
        1.2. Если пользователь оформляет заказ, оплачивает его, то согласно п.2
        ст. 437 Гражданского Кодекса РФ, такие действия рассматриваются как
        акцепт оферты. Пунктом 3 ст. 438 ГК РФ акцепт публичной оферты признан
        равносильным письменному договору.
      </Text>
      <Text style={s.content__paragraph}>
        1.3. Возникшие между сторонами правоотношения регулируются нормами ГК
        РФ, применяемыми, другими действующими законами и нормативными актами.
      </Text>
      <Text style={s.content__paragraph}>
        {' '}
        1.4. Оформляя заказ, физическое лицо подтверждает этим действием свои
        право и дееспособность.
      </Text>
      <Text
        style={[s.content__paragraph, {fontWeight: '700', marginVertical: 5}]}>
        2. Терминология
      </Text>
      <Text style={s.content__paragraph}>
        2.1. Значения терминов в договоре:
      </Text>
      <Text style={s.content__paragraph}>
        <Text style={[s.content__paragraph, {fontWeight: '700'}]}>Оферта</Text>
        <Text style={s.content__paragraph}>
          {' '}
          – данный документ, размещенный на сайте https://genray.ru/ и в
          устанавливаемом приложении. Он адресован совершеннолетним дееспособным
          лицам без ограничений.
        </Text>
      </Text>
      <Text style={s.content__paragraph}>
        <Text style={[s.content__paragraph, {fontWeight: '700'}]}>
          Акцепт оферты
        </Text>
        <Text style={s.content__paragraph}>
          {' '}
          – принятия всех условий, юридическим последствием чего становится
          вступление в договорные правоотношения.
        </Text>
      </Text>
      <Text style={s.content__paragraph}>
        <Text style={[s.content__paragraph, {fontWeight: '700'}]}>
          Веб—ресурс
        </Text>
        <Text style={s.content__paragraph}>
          {' '}
          – https://genray.ru/, принадлежащий компании ООО «Интернетика».
        </Text>
      </Text>
      <Text style={s.content__paragraph}>
        <Text style={[s.content__paragraph, {fontWeight: '700'}]}>
          Заказчик
        </Text>
        <Text style={s.content__paragraph}>
          {' '}
          – правоспособный, дееспособный пользователь, установивший приложение с
          https://genray.ru/, и сделавший заказ на предложенные услуги внутри
          приложения.
        </Text>
      </Text>
      <Text style={s.content__paragraph}>
        <Text style={[s.content__paragraph, {fontWeight: '700'}]}>
          Исполнитель
        </Text>
        <Text style={s.content__paragraph}>
          {' '}
          – клининговая компания ООО «Интернетика»
        </Text>
      </Text>
      <Text style={s.content__paragraph}>
        <Text style={[s.content__paragraph, {fontWeight: '700'}]}>
          Перечень услуг
        </Text>
        <Text style={s.content__paragraph}>
          {' '}
          – список услуг представлен в устанавливаемом приложении «M-Cleaning».
        </Text>
      </Text>
      <Text style={s.content__paragraph}>
        <Text style={[s.content__paragraph, {fontWeight: '700'}]}>
          Перечень услуг
        </Text>
        <Text style={s.content__paragraph}>
          – динамически вычесляемая в приложении на «M-Cleaning».
        </Text>
      </Text>
      <Text>
        <Text style={[s.content__paragraph, {fontWeight: '700'}]}>
          Служба поддержки
        </Text>
        <Text style={s.content__paragraph}>
          {' '}
          – сотрудники исполнителя, в должностные обязанности которых входят
          консультации, помощь в оформлении заказов, поддержание двусторонней
          связи и информирование о ходе выполнения работ.
        </Text>
      </Text>
      <Text style={s.content__paragraph}>
        2.2. Термины, определение которых не дано в п. 2, трактуются по смыслу
        сопутствующего теста и нормам ГК РФ. Приоритет отдается значению,
        используемом на сайте https://genray.ru/ и в установленном приложении, а
        не других сайтах.
      </Text>
      <Text
        style={[s.content__paragraph, {fontWeight: '700', marginVertical: 5}]}>
        3. Акцепт оферты
      </Text>
      <Text style={s.content__paragraph}>
        3.1. Компания ООО «Интернетика» принимает обязательства по проведению
        клининговых работ, на условиях, определенных договором и сформированной
        в мобильном приложении ценой услуги, а заказчик – оплачивает их в
        соответствии с выполненным объемом и ценами.
      </Text>
      <Text style={s.content__paragraph}>
        3.2. Размещенные на https://genray.ru/ и в приложении «M-Cleaning»
        договор оферты и вычесленная цена услуг рассматриваются как положения
        договора.
      </Text>
      <Text style={s.content__paragraph}>
        3.3. Заказчик принимает условия, установив соответствующую отметку. Если
        после установки такой отметки, заказ не оформлен, договор не считается
        заключенным и не создает никаких юридически значимых последствий для
        сторон.
      </Text>
      <Text style={s.content__paragraph}>
        3.4. Заказчик, принимая условия оферты и оформляя заказ, дает разрешение
        компании ООО «Интернетика» отправлять на указанный им телефон и адрес
        СМС—сообщения, письма.
      </Text>
      <Text style={s.content__paragraph}>
        3.5. Клиниговые работы могут выполняться как сотрудниками компании ООО
        «Интернетика», так и иными лицами, сотрудничающими с компанией ООО
        «Интернетика» на основе гражданско—правовых договоров, и прочих режимах
        трудовой деятельности, не нарушающей законодательство РФ.
        Ответственность за действия (деяния) всех лиц, привлекаемых к выполнению
        заказа, несет ООО «Интернетика».
      </Text>
      <Text
        style={[s.content__paragraph, {fontWeight: '700', marginVertical: 5}]}>
        4. Использование персональных данных
      </Text>
      <Text style={s.content__paragraph}>
        4.1. Персональные данные обрабатываются в соответствии с ч.2 ст. 6 ФЗ
        №1520ФЗ от 27.07.2006 г. «О персональных данных». Они не подлежат
        распространению и передаче третьим лицам.
      </Text>
      <Text style={s.content__paragraph}>
        4.2. Персональные данные допускается использовать только при продаже
        услуг, для идентификации и быстрой связи.
      </Text>
      <Text style={s.content__paragraph}>
        4.3. Заказчики не имеют право использовать на других сайтах или с иными
        целями контент, графику и другие элементы сайта компании ООО
        «Интернетика» без разрешения компании ООО «Интернетика» и заключения
        соответствующего договора.
      </Text>
      <Text style={s.content__paragraph}>
        4.4. Заказчик не возражает против получения рассылок ООО «Интернетика»,
        информирующих об услугах и ценах на них, проводимых акциях. Рассылки
        направляется в виде СМС—сообщений, на контактный номер телефона, либо в
        виде Push-уведомлений в приложении.
      </Text>
      <Text
        style={[s.content__paragraph, {fontWeight: '700', marginVertical: 5}]}>
        5. Оплата услуг
      </Text>
      <Text style={s.content__paragraph}>
        5.1. Оплата услуг в приложении производится через интернет эквайринг,
        подключенный в мобильном приложении, на сумму полученную в результате
        вычисления стоимости услуги.
      </Text>
      <Text style={s.content__paragraph}>
        5.2. Оплата услуг может производится методом начисления денежных средств
        на баланс приложения в произвольной сумме, указанной пользователем, для
        дальнейшей оплаты заказываемых услуг.
      </Text>
      <Text
        style={[s.content__paragraph, {fontWeight: '700', marginVertical: 5}]}>
        6. Условия покупки возврата
      </Text>
      <Text style={s.content__paragraph}>
        6.1. Возврат денежных средств за нереализованные услуги с баланса
        пользователя, производится по запросу пользователя в техническую
        поддержку через контактную форму в приложении «M-Cleaning. Сроки и
        условия возврата регулируется действующим законодательством РФ.
      </Text>
      <Text style={s.content__paragraph}>
        6.2. При совершении возврата, сумма равняется сумме неиспользованных
        средств на балансе пользователя.
      </Text>
      <Text style={s.content__paragraph}>
        6.3. При совершении возврата, из общей суммы на балансе пользователя,
        вычитается сумма бонусных рублей.
      </Text>
      <Text
        style={[s.content__paragraph, {fontWeight: '700', marginVertical: 5}]}>
        7. Бонусные рубли
      </Text>
      <Text style={s.content__paragraph}>
        7.1. Бонусные рубли начисляются на баланс пользователя и могут быть
        потрачены на оплату услуг в приложении как частично так и полностью.
      </Text>
      <Text style={s.content__paragraph}>
        7.2. Бонусные рубли нельзя вывести с баланса пользователя.
      </Text>
    </View>,
  ];
  return (
    <Modalize
      ref={combinedRef}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        stickyHeaderIndices: [0],
      }}>
      {renderContent()}
    </Modalize>
  );
});

const s = StyleSheet.create({
  content__header: {
    padding: 15,
    paddingBottom: 0,

    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  content__heading: {
    marginBottom: 2,

    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },

  content__subheading: {
    marginBottom: 20,

    fontSize: 16,
    color: '#ccc',
  },

  content__inside: {
    padding: 20,
  },

  content__paragraph: {
    fontSize: 15,
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },

  content__scrollview: {
    marginVertical: 20,
  },

  content__block: {
    width: 200,
    height: 80,

    marginRight: 20,

    backgroundColor: '#ccc',
  },

  content__input: {
    paddingVertical: 15,
    marginBottom: 10,

    width: '100%',

    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#cdcdcd',
    borderRadius: 6,
  },
});
