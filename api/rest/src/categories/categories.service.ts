import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import Fuse from 'fuse.js';
import categoriesJson from '@db/categories.json';
import { paginate } from 'src/common/pagination/paginate';

const categories = plainToClass(Category, categoriesJson);
const options = {
	keys: ['name', 'shops.slug'],
	threshold: 0.3,
};
const fuse = new Fuse(categories, options);

@Injectable()
export class CategoriesService {
	private categories: Category[] = categories;

	create(createCategoryDto: CreateCategoryDto) {
		return this.categories[0];
	}

	getCategories({ limit, page, search, parent }: GetCategoriesDto) {
		return getMyCategories().then((res) => {
			const odooCategories = plainToClass(Category,  res as any[]);
			if (!page) page = 1;
			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;
			this.categories = odooCategories;
			let data: Category[] = odooCategories;
			// console.log("category data: ",data);
			const f = new Fuse(this.categories, options);
			// console.log("search param in category service: ",search);
			if (search) {
				const parseSearchParams = search.split(';');
				for (const searchParam of parseSearchParams) {
					const [key, value] = searchParam.split(':');
					if(key === "type.slug")
						continue
					// data = data.filter((item) => item[key] === value);
					data = f.search(value)?.map(({ item }) => item);
				}
			}
			// if (parent === 'null') {
			// 	data = data.filter((item) => item.parent === null);
			// }
			// if (text?.replace(/%/g, '')) {
			//   data = fuse.search(text)?.map(({ item }) => item);
			// }
			// if (hasType) {
			//   data = fuse.search(hasType)?.map(({ item }) => item);
			// }

			const results = data.slice(startIndex, endIndex);
			const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;
			const cats = {
				data: results,
				...paginate(data.length, page, limit, results.length, url),
			};
			// console.log("cats result: ",cats);
			return cats;
		})
	}

	getCategory(param: string, language: string): Category {
		return this.categories.find(
			(p) => p.id === Number(param) || p.slug === param,
		);
	}

	update(id: number, updateCategoryDto: UpdateCategoryDto) {
		return this.categories[0];
	}

	remove(id: number) {
		return `This action removes a #${id} category`;
	}
}


export async function getMyCategories() {
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

		const url = "http://45.79.219.141:8070/categories/list";

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Cookie": 'session_id=' + sessionId,
			},
		});
		const t = await response.json()
			.then((res) => {
				return res.cat_response;
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
