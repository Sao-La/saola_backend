'use strict';

const { Province } = require('../models');
const { SLError, errorCodes } = require('../utils/error');

/**
 * 
 * @returns {Object[]} Provinces
 */

exports.getProvinces = async () => {
  try {
    const provinces = await Province.findAll({ raw: true });
    return {
      provinces,
    }
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.read_province_error, err);
  }
}

/**
 * 
 * @param {Object[]} provinces 
 * @returns {Object[]} Created provinces
 */

exports.createProvinces = async (provinces) => {
  try {
    const createdProvinces = await Promise.all(provinces.map(province => new Promise(async resolve => {
      const _province = await Province.findOne({ where: { name: province.name }, raw: true });
      if (_province)
        return resolve(null);
  
      const createdProvince = await Province.create(province, { raw: true });
      return resolve(createdProvince);
    })));

    return {
      provinces: createdProvinces.filter(p => p !== null),
    }
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.create_province_error, err);
  }
}

/**
 * 
 * @param {Object[]} provinces 
 * @returns {Object[]} Updated provinces
 */

exports.updateProvinces = async (provinces) => {
  try {
    const updatedProvinces = await Promise.all(provinces.map(province => new Promise(async resolve => {
      const _province = await Province.findOne({ where: { name: province.name }, raw: true });
      if (!_province)
        return resolve(null);

      const updatedProvince = await Province.update({
        count: province.count,
      }, { 
        where: {
          name: province.name,
        },
        returning: true, 
      });

      return resolve(updatedProvince[1][0]);
    })));

    return {
      provinces: updatedProvinces.filter(p => p !== null),
    }
  }
  catch (err) {
    console.error(err);
    throw new SLError(errorCodes.update_province_error, err);
  }
}

exports.initializeProvinces = async () => {
  const provinceData = {"VNM429": "Qu???ng Ninh", "VNM444": "T??y Ninh", "VNM450": "??i???n Bi??n", "VNM451": "B???c K???n", "VNM452": "Th??i Nguy??n", "VNM453": "Lai Ch??u", "VNM454": "L???ng S??n", "VNM455": "S??n La", "VNM456": "Thanh H??a", "VNM457": "Tuy??n Quang", "VNM458": "Y??n B??i", "VNM459": "H??a B??nh", "VNM460": "H???i D????ng", "VNM4600": "H???i Ph??ng", "VNM461": "H??ng Y??n", "VNM462": "H?? N???i", "VNM463": "B???c Ninh", "VNM464": "V??nh Ph??c", "VNM466": "Ninh B??nh", "VNM467": "H?? Nam", "VNM468": "Nam ?????nh", "VNM469": "Ph?? Th???", "VNM470": "B???c Giang", "VNM471": "Th??i B??nh", "VNM474": "H?? T??nh", "VNM475": "Ngh??? An", "VNM476": "Qu???ng B??nh", "VNM477": "?????k L???k", "VNM478": "Gia Lai", "VNM479": "Kh??nh H??a", "VNM480": "L??m ?????ng", "VNM481": "Ninh Thu???n", "VNM482": "Ph?? Y??n", "VNM483": "B??nh D????ng", "VNM4834": "Ti???n Giang", "VNM4835": "?????k N??ng", "VNM484": "B??nh Ph?????c", "VNM485": "B??nh ?????nh", "VNM486": "Kon Tum", "VNM487": "Qu??ng Nam", "VNM488": "Qu???ng Ng??i", "VNM489": "Qu???ng Tr???", "VNM490": "Th???a Thi??n - Hu???", "VNM491": "???? N???ng", "VNM495": "B?? R???a - V??ng T??u", "VNM496": "B??nh Thu???n", "VNM497": "?????ng Nai", "VNM498": "An Giang", "VNM499": "C???n Th??", "VNM500": "?????ng Th??p", "VNM501": "Th??nh ph??? H??? Ch?? Minh", "VNM502": "Ki??n Giang", "VNM503": "Long An", "VNM504": "B???n Tre", "VNM505": "H???u Giang", "VNM506": "B???c Li??u", "VNM507": "C?? Mau", "VNM508": "S??c Tr??ng", "VNM509": "Tr?? Vinh", "VNM510": "V??nh Long", "VNM511": "Cao B???ng", "VNM512": "H?? Giang", "VNM5483": "L??o Cai"}
  
  await this.createProvinces(Object.keys(provinceData).map(pk => ({
    name: provinceData[pk],
    code: pk,
  })));
}
