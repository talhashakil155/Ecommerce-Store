import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto, ProductPaginator } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { paginate } from 'src/common/pagination/paginate';
import productsJson from '@db/products.json';
import popularProductsJson from '@db/popular-products.json';
import bestSellingProductsJson from '@db/best-selling-products.json';
import Fuse from 'fuse.js';
import { GetPopularProductsDto } from './dto/get-popular-products.dto';
import { GetBestSellingProductsDto } from './dto/get-best-selling-products.dto';

const products = plainToClass(Product, productsJson);
const popularProducts = plainToClass(Product, popularProductsJson);
const bestSellingProducts = plainToClass(Product, bestSellingProductsJson);

const options = {
	keys: [
		'name',
		// 'type.slug',
		'categories.slug',
		'status',
		'shop_id',
		'author.slug',
		'tags',
		'manufacturer.slug',
		'shops.slug'
	],
	threshold: 0.3,
};
const fuse = new Fuse(products, options);

@Injectable()
export class ProductsService {
	private products: any = products;
	private popularProducts: any = popularProducts;
	private bestSellingProducts: any = bestSellingProducts;

	create(createProductDto: CreateProductDto) {
		return this.products[0];
	}

	// async getProducts({ limit, page, search }: GetProductsDto): Promise<ProductPaginator> {
	// 	try {
	// 		const a = await getProductsFromOdoo().then((res) => {
	// 			const odooProducts = plainToClass(Product, res as any[]);
	// 			if (!page) page = 1;
	// 			if (!limit) limit = 30;
	// 			const startIndex = (page - 1) * limit;
	// 			const endIndex = page * limit;
	// 			// let data: Product[] = this.products;
	// 			let data: Product[] = odooProducts;
	// 			this.products = data;
	// 			console.log("i am here with data: ", data);
	// 			// console.log("this.products: ", this.products);
	// 			if (search) {
	// 				const parseSearchParams = search.split(';');
	// 				const searchText: any = [];
	// 				for (const searchParam of parseSearchParams) {
	// 					const [key, value] = searchParam.split(':');
	// 					// TODO: Temp Solution
	// 					if (key !== 'slug') {
	// 						searchText.push({
	// 							[key]: value,
	// 						});
	// 					}
	// 				}
	// 				data = fuse
	// 					.search({
	// 						$and: searchText,
	// 					})
	// 					?.map(({ item }) => item);
	// 			}

	// 			const results = data.slice(startIndex, endIndex);
	// 			// console.log("results: ", results);
	// 			const url = `/products?search=${search}&limit=${limit}`;
	// 			const abc = {
	// 				data: results,
	// 				...paginate(data.length, page, limit, results.length, url),
	// 			};
	// 			console.log("i am here 2 : ");
	// 			return abc
	// 		})
	// 		return a

	// 	} catch (error) {
	// 		console.error('error:', error);
	// 	}
	// 	// return getProductsFromOdoo().then((res) => {
	// 	// 	// const odooProducts = plainToClass(Product, res as any[]);
	// 	// 	if (!page) page = 1;
	// 	// 	if (!limit) limit = 30;
	// 	// 	const startIndex = (page - 1) * limit;
	// 	// 	const endIndex = page * limit;
	// 	// 	let data: Product[] = this.products;
	// 	// 	// this.products = data
	// 	// 	if (search) {
	// 	// 		const parseSearchParams = search.split(';');
	// 	// 		const searchText: any = [];
	// 	// 		for (const searchParam of parseSearchParams) {
	// 	// 			const [key, value] = searchParam.split(':');
	// 	// 			// TODO: Temp Solution
	// 	// 			if (key !== 'slug') {
	// 	// 				searchText.push({
	// 	// 					[key]: value,
	// 	// 				});
	// 	// 			}
	// 	// 		}
	// 	// 		console.log("i am here with search params: ", parseSearchParams);
	// 	// 		data = fuse
	// 	// 			.search({
	// 	// 				$and: searchText,
	// 	// 			})
	// 	// 			?.map(({ item }) => item);
	// 	// 	}

	// 	// 	const results = data.slice(startIndex, endIndex);
	// 	// 	// console.log("results: ", results);
	// 	// 	const url = `/products?search=${search}&limit=${limit}`;
	// 	// 	return {
	// 	// 		data: results,
	// 	// 		...paginate(data.length, page, limit, results.length, url),
	// 	// 	};
	// 	// })


	// 	// if (!page) page = 1;
	// 	// if (!limit) limit = 30;
	// 	// const startIndex = (page - 1) * limit;
	// 	// const endIndex = page * limit;
	// 	// let data: Product[] = this.products;
	// 	// if (search) {
	// 	//   const parseSearchParams = search.split(';');
	// 	//   const searchText: any = [];
	// 	//   for (const searchParam of parseSearchParams) {
	// 	//     const [key, value] = searchParam.split(':');
	// 	//     // TODO: Temp Solution
	// 	//     if (key !== 'slug') {
	// 	//       searchText.push({
	// 	//         [key]: value,
	// 	//       });
	// 	//     }
	// 	//   }
	// 	//   data = fuse
	// 	//     .search({
	// 	//       $and: searchText,
	// 	//     })
	// 	//     ?.map(({ item }) => item);
	// 	// }

	// 	// const results = data.slice(startIndex, endIndex);
	// 	// // console.log("results: ", results);
	// 	// const url = `/products?search=${search}&limit=${limit}`;
	// 	// const abc = {
	// 	//   data: results,
	// 	//   ...paginate(data.length, page, limit, results.length, url),
	// 	// };
	// 	// console.log("i am here with abc: ", abc);
	// 	// return abc
	// }

	getProducts({ limit, page, search }: GetProductsDto): ProductPaginator {
		try {
			return getProductsFromOdoo().then((res) => {
				const odooProducts = plainToClass(Product, res as any[]);
				if (!page) page = 1;
				if (!limit) limit = 30;
				const startIndex = (page - 1) * limit;
				const endIndex = page * limit;

				this.products = odooProducts;
				let data: Product[] = odooProducts;
				const f = new Fuse(this.products, options);

				console.log("search param in products service: ", search);
				if (search) {
					const parseSearchParams = search.split(';');
					const searchText: any = [];
					for (const searchParam of parseSearchParams) {
						const [key, value] = searchParam.split(':');
						if (key === "type.slug" || key === "shop_id")
							continue
						// TODO: Temp Solution
						if (key !== 'slug') {
							searchText.push({
								[key]: value,
							});
						}
					}
					data = f.search({ $and: searchText, })?.map(({ item }) => item) as Product[];
				}
				const results = data.slice(startIndex, endIndex);
				// console.log("results: ", results);
				const url = `/products?search=${search}&limit=${limit}`;
				const prodPaginator = {
					data: results,
					...paginate(data.length, page, limit, results.length, url),
				} as ProductPaginator;
				return prodPaginator;
			}) as unknown as ProductPaginator;
		} catch (error) {
			console.error('error:', error);
		}
	}

	getProductBySlug(slug: string): Product {
		console.log("i am in getProductBySlug");
		const product = this.products.find((p) => p.slug === slug);
		const related_products = this.products
			.filter((p) => p.type.slug === product.type.slug)
			.slice(0, 20);
		return {
			...product,
			related_products,
		};
	}

	getPopularProducts({ limit, type_slug }: GetPopularProductsDto): Product[] {
		let data: any = this.popularProducts;
		if (type_slug) {
			data = fuse.search(type_slug)?.map(({ item }) => item);
		}
		return data?.slice(0, limit);
	}
	getBestSellingProducts({ limit, type_slug }: GetBestSellingProductsDto): Product[] {
		let data: any = this.bestSellingProducts;
		if (type_slug) {
			data = fuse.search(type_slug)?.map(({ item }) => item);
		}
		return data?.slice(0, limit);
	}

	getProductsStock({ limit, page, search }: GetProductsDto): ProductPaginator {
		if (!page) page = 1;
		if (!limit) limit = 30;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		let data: Product[] = this.products.filter((item) => item.quantity <= 9);

		if (search) {
			const parseSearchParams = search.split(';');
			const searchText: any = [];
			for (const searchParam of parseSearchParams) {
				const [key, value] = searchParam.split(':');
				// TODO: Temp Solution
				if (key !== 'slug') {
					searchText.push({
						[key]: value,
					});
				}
			}

			data = fuse
				.search({
					$and: searchText,
				})
				?.map(({ item }) => item);
		}

		const results = data.slice(startIndex, endIndex);
		const url = `/products-stock?search=${search}&limit=${limit}`;
		return {
			data: results,
			...paginate(data.length, page, limit, results.length, url),
		};
	}

	getDraftProducts({ limit, page, search }: GetProductsDto): ProductPaginator {
		if (!page) page = 1;
		if (!limit) limit = 30;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		let data: Product[] = this.products.filter(
			(item) => item.status === 'draft',
		);

		if (search) {
			const parseSearchParams = search.split(';');
			const searchText: any = [];
			for (const searchParam of parseSearchParams) {
				const [key, value] = searchParam.split(':');
				// TODO: Temp Solution
				if (key !== 'slug') {
					searchText.push({
						[key]: value,
					});
				}
			}

			data = fuse
				.search({
					$and: searchText,
				})
				?.map(({ item }) => item);
		}

		const results = data.slice(startIndex, endIndex);
		const url = `/draft-products?search=${search}&limit=${limit}`;
		return {
			data: results,
			...paginate(data.length, page, limit, results.length, url),
		};
	}

	update(id: number, updateProductDto: UpdateProductDto) {
		return this.products[0];
	}

	remove(id: number) {
		return `This action removes a #${id} product`;
	}
}


export async function getProductsFromOdoo() {
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

		const url = "http://45.79.219.141:8070/shop/products/list?shop_id=all";

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Cookie": 'session_id=' + sessionId,
			},
		});
		const t = await response.json()
			.then((res) => {
				return res.product_response;
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
