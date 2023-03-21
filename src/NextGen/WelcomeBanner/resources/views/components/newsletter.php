<template id="givewp-welcome-banner-newsletter">
    <style>
        form {
            display: flex;
            flex-wrap:wrap;
            gap:8px;
        }
        input {
            flex:3;
            padding: 12px 24px 12px 16px;
            border-radius: 2px;
            border: solid 1px var(--givewp-grey-300);
            background-color: var(--givewp-shades-white);
        }
        button {
            flex: 1;
            font-size: 14px;
            color: white;
            padding: 12px 24px;
            border-radius: 2px;
            border: solid 1px var(--givewp-green-500);
            background-color: var(--givewp-green-500);
        }
    </style>
    <form>
        <input
            type="email"
            value="<?php echo wp_get_current_user()->user_email; ?>"
            placeholder="<?php esc_attr_e('Enter your email address', 'give'); ?>"
        />
        <button type="submit">
            <?php _e('Submit', 'give'); ?>
        </button>
    </form>
</template>

<script>
    (() => {
        const template = document.getElementById('givewp-welcome-banner-newsletter')

        window.customElements.define('givewp-welcome-banner-newsletter', class extends HTMLElement {
            connectedCallback() {
                this.attachShadow({mode: 'open'});
                this.shadowRoot.appendChild(template.content.cloneNode(true));

                const form = this.shadowRoot.querySelector("form");
                form.addEventListener("submit", this.handleSubmit);
            }

            handleSubmit(e) {
                e.preventDefault();
                console.log(this.querySelector("input").value);
                fetch('https://connect.givewp.com/activecampaign/subscribe/next-gen-beta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'subscribe',
                        email: this.querySelector("input").value,
                        first_name: '<?php echo wp_get_current_user()->user_firstname; ?>',
                        last_name: '<?php echo wp_get_current_user()->user_lastname; ?>',
                        website_url: '<?php echo get_bloginfo('url'); ?>',
                        website_name: '<?php echo get_bloginfo('sitename'); ?>',
                    }),
                })
                    .then(response => alert('Thank you for subscribing!'))
                    .catch(error => alert('There was an error subscribing you to our newsletter. Please try again later.'));
            }
        });
    })()
</script>
