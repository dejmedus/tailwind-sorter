extern crate reqwest_wasm;

use bounce::BounceRoot;
use yew::prelude::*;

mod components;
mod controllers;


#[function_component]
fn App() -> Html {
    style! {
        let important_css = css!(filename = "important") {r#"
            background: red;
            color: #000033;
        "#};
        let css = css! {r#"
            border: solid green 1px;
            width: 100%;
            height: 150px;
            text-align: center;
            box-sizing: border-box;

            & > p {
                background: white;
            }
        "#};
    }
    html! {
        <BounceRoot>
            <main>
                <div class="container mx-auto pt-24 bg-pink-200 py-12 px-6">
                    <components::counter::Counter />
                    <components::footer::Footer />
                </div>
                 <div class={classes!(important_css, css)}>
                    <p>{"compile time static css"}</p>
                    </div>
            </main>
        </BounceRoot>
    }
}

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    yew::Renderer::<App>::new().render();
}
