import { verifyJwtToken } from "@/libs/auth/index";
import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

const AUTH_PAGES = ["/login", "/register", "/forgot-password"];

const isAuthPages = (url) => {
  return AUTH_PAGES.some((authPage) => authPage.startsWith(url));
};

export async function middleware(req) {
  // url : Bu, gelen HTTP isteğinin tam URL'ini döndürür. Yani, istemcinin gönderdiği URL'yi içerir.
  // Genellikle, örneğin http://localhost:3000/about gibi, tam adresi elde etmek için kullanılır.

  // nextUrl : Bu, Next.js'teki özel bir URL objesidir.
  // nextUrl, Next.js’in isteği işleme mekanizması ile ilgili ek bilgileri içerir ve genellikle Next.js'in yönlendirme ve rota yönetimi ile ilgilidir.
  //  Bu, daha çok ileriye dönük URL dönüşümleri, yönlendirmeler (redirect) veya URL parametreleri üzerinde işlem yapmayı kolaylaştırır.

  // cookies : Bu, gelen istekteki cookies verilerini döndürür. Cookies, istemci ve sunucu arasında veri taşımak için kullanılan küçük veritabanlarıdır.
  //  Kullanıcı oturumları, kimlik doğrulama bilgileri gibi veriler genellikle bu alanda tutulur.
  //  cookies, genellikle req.cookies olarak da kullanılabilir ve bu veri üzerinden kullanıcı oturumu veya diğer durum bilgileri erişilebilir.

  const { url, nextUrl, cookies } = req;

  //cookies.get sonucunda bu obje döndüğü için bunu destruct edicez
  /* 
    {
        key:'token',
        value: "1234567897asdas"
    } 
  */
  const { value: token } = cookies.get("token") ?? { value: null };

  // token'ın verify olup olmadığını kontrol etmeliyiz
  // bir kullanıcı token hash mekanizmasını çözüp application kısmından girip token tanımalayabilir
  // bundan kaynaklı her token key ini kontrol etmeliyiz
  const hasVerifiedToken = token && (await verifyJwtToken(token));

  // middleware çalşırken kullanıcının hangi sayfada olduğunu kontrol edeceğiz
  // kontrol etmezsek kullanıcı giriş yapmadıysa henüz aşağıdaki !hasVerifiedToken if yapısına girerek sonsuz bir döngü olur
  // nextUrl.pathname : kullanıcının şu anda girmke isteğigi sayfayı verir örneğin /logine girmeyi deniyorsa /login değerini döner
  const isAuthPageRequested = isAuthPages(nextUrl.pathname);

  //kullanıcı eğer AUTH_PAGES lerden birine girmeyi deniyorsa (login,register,forget password)
  if (isAuthPageRequested) {
    // token'ı yoksa yönlendirilebilir
    if (!hasVerifiedToken) {
      return NextResponse.next();
    }
    // eğer token'ı var ise
    return NextResponse.redirect(new URL("/", url));
  }

  console.log("hasVerifiedToken : ", hasVerifiedToken);

  // Token yoksa kullanıcıyı login sayfasına yönlendiriyoruz
  if (!hasVerifiedToken) {
    // NextURL.searchParams : url de farklı search paramslar var ise bunları da almasını sağlar
    const searchParams = new URLSearchParams(nextUrl.searchParams);
    searchParams.set("next", nextUrl.pathname);
    console.log("search params : ", searchParams);

    return NextResponse.redirect(new URL(`/login?${searchParams}`, url));
  }

  // token var ise kullanıcı hangi sayfaya gitmek istiyorsa o syafaya yönlendiricez
  return NextResponse.next();
}

export const config = {
  // Hangi sayfalarda bu kontrolü yapmak istiyorsam matcher içerisine o sayfaları vereceğim
  matcher: [
    "/login", // login sayfasında bu kontrol yapılmalı çünkü kullanıcı giriş yaptıysa login sayfasını görüntüleyememelidir.
    // kullanıcı loginken tekrar login sayfasına girmeye çalışırsa fakrlı bir sayfaya redirect etmek için kullanabiilriz
    "/panel", // panel sayfasını sadece giriş yapan kullanıcılar görebilmelidir
    //"/panel/:path*"  panel altında farklı routelar varsa ve hepsini kapsamak istiyorsak
  ],
};
