import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import shopsJson from '@db/shops.json';
import nearShopJson from '@db/near-shop.json';
import Fuse from 'fuse.js';
import { GetShopsDto } from './dto/get-shops.dto';
import { paginate } from 'src/common/pagination/paginate';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { Console } from 'console';
import { User } from '../users/entities/user.entity';
import usersJson from '@db/users.json';


const shops = plainToClass(Shop, shopsJson);
const nearShops = plainToClass(Shop, nearShopJson);
const users = plainToClass(User, usersJson);
const options = {
  keys: ['name', 'type.slug', 'is_active'],
  threshold: 0.3,
};
const fuse = new Fuse(shops, options);

function formatSlug(inputString: string): string {
  if (!inputString) return '';
  /* This line is replacing any whitespace with hyphens (`-`) and converting the string to lowercase. */
  const replacedString = inputString.replace(/\s+/g, '-').toLowerCase();
  /* This Line is removing any trailing hyphens from the `replacedString`. */
  const trimmedString = replacedString.replace(/-+$/, '');
  return trimmedString;
}

@Injectable()
export class ShopsService {
  private shops: Shop[];
  private nearShops: Shop[] = shops;

  create(createShopDto: CreateShopDto) {
    createShopDto.slug = formatSlug(createShopDto.name)
    const createRequestBody = {
      "name": createShopDto.name,
      "slug": createShopDto.slug,
      "owner": users[0]['id'],    // will it be current user or we want to show options of owner?
      "shop_description": createShopDto.description,
      "status": "True",
      "country": createShopDto.address.country,
      "city": createShopDto.address.city,
      "state": createShopDto.address.state,
      "zip": createShopDto.address.zip,
      "street_address": createShopDto.address.street_address,
      "account": createShopDto.balance.payment_info.account,
      "account_name": createShopDto.balance.payment_info.name,
      "account_email": createShopDto.balance.payment_info.email,
      "account_bank": createShopDto.balance.payment_info.bank,
      "warehouse_id": 1,
    }
    
    if(createShopDto.logo.changed)
      createRequestBody['logo'] = createShopDto.logo.original;

    if(createShopDto.cover_image.changed)
      createRequestBody['cover_image'] = createShopDto.cover_image.original;

    createShopDetails(createRequestBody)
      .then((res) => {
        return getMyshopes()
          .then((res2) => {
            const fetchShops = plainToClass(Shop, res as any[]);
            this.shops = fetchShops;
          })
      })
  }

  getShops({ search, limit, page }: GetShopsDto) {

    return getMyshopes().then((res) => {
      const fetchShops = plainToClass(Shop, res as any[]);
      if (!page) page = 1;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      let data: Shop[] = fetchShops;
      this.shops = data;
      const f = new Fuse(this.shops, options);
      if (search) {
        const parseSearchParams = search.split(';');
        for (const searchParam of parseSearchParams) {
          const [key, value] = searchParam.split(':');
          // data = data.filter((item) => item[key] === value);
          data = f.search(value)?.map(({ item }) => item);
        }
      }
      // if (text?.replace(/%/g, '')) {
      //   data = fuse.search(text)?.map(({ item }) => item);
      // }
      const results = data.slice(startIndex, endIndex);
      const url = `/shops?search=${search}&limit=${limit}`;
      return {
        data: results,
        ...paginate(data.length, page, limit, results.length, url),
      };
    });
  }

  getNewShops({ search, limit, page }: GetShopsDto) {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: Shop[] = this.shops.filter(
      (shopItem) => Boolean(shopItem.is_active) === false,
    );

    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }
    const results = data.slice(startIndex, endIndex);
    const url = `/new-shops?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getStaffs({ shop_id, limit, page }: GetStaffsDto) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let staffs: Shop['staffs'] = [];
    if (shop_id) {
      staffs = (this.shops || []).find((p) => p.id === Number(shop_id))?.staffs ?? [];
    }
    const results = staffs?.slice(startIndex, endIndex);
    const url = `/staffs?limit=${limit}`;

    return {
      data: results,
      ...paginate(staffs?.length, page, limit, results?.length, url),
    };
  }

  getShop(slug: string): Shop {
    getMyshopes().then((res) => {
      const fetchShops = plainToClass(Shop, res as any[]);
      let data: Shop[] = fetchShops;
      this.shops = data;
    });
    const result = (this.shops || []).find((p) => p.slug === slug);
    return result;

  }

  getNearByShop(lat: string, lng: string) {
    return nearShops;
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    const updateRequestBody = {
      "name": updateShopDto.name,
      "shop_description": updateShopDto.description,
      "country": updateShopDto.address.country,
      "city": updateShopDto.address.city,
      "state": updateShopDto.address.state,
      "zip": updateShopDto.address.zip,
      "street_address": updateShopDto.address.street_address,
      "account": updateShopDto.balance.payment_info.account,
      "account_name": updateShopDto.balance.payment_info.name,
      "account_email": updateShopDto.balance.payment_info.email,
      "account_bank": updateShopDto.balance.payment_info.bank,
    }

    if(updateShopDto.logo.changed)
      updateRequestBody['logo'] = updateShopDto.logo.original;

    if(updateShopDto.cover_image.changed)
      updateRequestBody['cover_image'] = updateShopDto.cover_image.original;

    updateShopDetails(id.toString(), updateRequestBody)
      .then((res) => {
        return getMyshopes()
          .then((res2) => {
            (this.shops || []).find((s) => s.id === Number(id));
          })
      })
  }

  approve(id: number) {
    return `This action removes a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }

  disapproveShop(id: number) {
    const shop = (this.shops || []).find((s) => s.id === Number(id));
    shop.is_active = false;

    return shop;
  }

  approveShop(id: number) {
    const requestBody = {
      is_active: 1
    }
    const response = updateShopDetails(id.toString(), requestBody)
    const shop = (this.shops || []).find((s) => s.id === Number(id));
    //shop.is_active = true;

    return shop;
  }
}

export async function createShopDetails(requestBody: any) {
  //console.log("updatedto = ", JSON.stringify(requestBody))
  const cookieHeader = await getAuthenticationToken()
    .then((authResponse) => {
      return authResponse.headers.get('set-cookie');
    });
  let sessionId = null;

  if (cookieHeader) {
    // // Extract session ID from cookies
    const cookies = cookieHeader.split(';');
    cookies.forEach(cookie => {
      if (cookie.trim().startsWith('session_id=')) {
        sessionId = cookie.trim().substring('session_id='.length);
      }
    });

    //console.log('Session ID:', sessionId);


    // shop list call

    //    const url = "http://45.79.219.141:8070/shops/list";
    const url = "http://45.79.219.141:8070/shops/create";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": 'session_id=' + sessionId,
      },
      body: JSON.stringify(requestBody),
    });
    // .then((res) => { 
    //   return res.text();});
    const t = await response.json()
      // .then((res) => {
      //   return res.shops_response;
      // })
      ;

    //console.log("t: ", t);
    return t;
  }
}

export async function updateShopDetails(shopId: String, requestBody: any) {
  //console.log("updatedto = ", JSON.stringify(requestBody))
  const cookieHeader = await getAuthenticationToken()
    .then((authResponse) => {
      return authResponse.headers.get('set-cookie');
    });
  let sessionId = null;

  if (cookieHeader) {
    // // Extract session ID from cookies
    const cookies = cookieHeader.split(';');
    cookies.forEach(cookie => {
      if (cookie.trim().startsWith('session_id=')) {
        sessionId = cookie.trim().substring('session_id='.length);
      }
    });

    //console.log('Session ID:', sessionId);


    // shop list call

    //    const url = "http://45.79.219.141:8070/shops/list";
    const url = "http://45.79.219.141:8070/shops/edit/" + shopId;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": 'session_id=' + sessionId,
      },
      body: JSON.stringify(requestBody),
    });
    // .then((res) => { 
    //   return res.text();});
    const t = await response.json()
      // .then((res) => {
      //   return res.shops_response;
      // })
      ;

    //console.log("t: ", t);
    return t;
  }
}

export async function getMyshopes() {
  const cookieHeader = await getAuthenticationToken()
    .then((authResponse) => {
      return authResponse.headers.get('set-cookie');
    });
  let sessionId = null;

  if (cookieHeader) {
    const cookies = cookieHeader.split(';');
    cookies.forEach(cookie => {
      if (cookie.trim().startsWith('session_id=')) {
        sessionId = cookie.trim().substring('session_id='.length);
      }
    });

    const url = "http://45.79.219.141:8070/shops/list?shop_id=all";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": 'session_id=' + sessionId,
      },
    });

    const t = await response.json()
      .then((res) => {
        return res.shops_response;
      });
    return t;
  }
}

export async function getAuthenticationToken() {
  const authUrl = "http://45.79.219.141:8070/user/authenticate/login";
  const authRequestBody = {
    username: 'admin',
    password: 'admin'
  };

  const authResponse = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authRequestBody),
    credentials: 'include'
  });
  return authResponse;
}
