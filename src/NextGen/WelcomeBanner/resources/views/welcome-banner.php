<style>
    .welcome-banner--theme {
        --primary-main-700: #5ba65e;
        --primary-main-800: #3f7341;
        --primary-main-600: #15ae56;
        --primary-main-500: #68bf6b;
        --primary-main-200: #e5ffe6;
        --shade-white: #fff;
        --shade-black: #000c00;
        --neutral-70: #b8c6cc;
        --neutral-80: #8fa8b2;
        --neutral-90: #6b8b99;
        --neutral-100: #3d5a66;
        --neutral-110: #233740;
        --primary-main-300: #c2f2c3;
        --neutral-120: #0d161a;
        --primary-main-400: #aaf2ac;
        --grey-10: #f2f2f2;
        --grey-20: #e6e6e6;
        --grey-30: #d9d9d9;
        --grey-40: #bfbfbf;
        --grey-80: #595959;
        --grey-60: #8c8c8c;
        --grey-100: #1e1e1e;
        --alert-80: #db5454;
        --alert-100: #dc1e1e;
        --alert-60: #e99090;
        --alert-40: #f5bebe;
        --alert-10: #fff2f2;
        --wp-gray-gray-30: #8c8f94;
        --gutenberg-white: #fff;
        --alert-20: #ffe5e5;
        --gutenberg-gray-700: #757575;
        --gutenberg-gray-900: #1e1e1e;
        --upcoming-blueberry: #3858e9;
        --upcoming-pomegrade: #e26f56;
        --wp-yellow-yellow-40: #bd8600;
        --wp-yellow-yellow-0: #fcf9e8;
        --green-25: #f2fff3;
        --green-50: #e5ffe6;
        --green-100: #cef2cf;
        --green-200: #a3d9a4;
        --green-300: #7cbf7e;
        --green-400: #62b265;
        --green-500: #459948;
        --green-600: #2d802f;
        --green-700: #19661c;
        --green-800: #0a400b;
        --green-900: #022603;
        --blue-25: #f2f9ff;
        --blue-50: #d9ecff;
        --blue-100: #a6d2ff;
        --blue-200: #73b9ff;
        --blue-300: #3d97f2;
        --blue-400: #0c7ff2;
        --blue-500: #0b72d9;
        --blue-600: #0857a6;
        --blue-700: #074a8c;
        --blue-800: #052f59;
        --blue-900: #001326;
        --emerald-25: #f2fff9;
        --emerald-50: #d9ffec;
        --emerald-100: #9df2c8;
        --emerald-200: #6df2b0;
        --emerald-300: #3df297;
        --emerald-400: #0cf27f;
        --emerald-500: #0bd972;
        --emerald-600: #08a657;
        --emerald-700: #078c4a;
        --emerald-800: #05592f;
        --emerald-900: #002613;
        --yellow-25: #fffdf2;
        --yellow-50: #fff9d9;
        --yellow-100: #fff0a6;
        --yellow-200: #ffe873;
        --yellow-300: #ffdf40;
        --yellow-400: #f2cc0c;
        --yellow-500: #d9b60b;
        --yellow-600: #a68c08;
        --yellow-700: #8c7607;
        --yellow-800: #594b05;
        --yellow-900: #262000;
        --orange-800: #402806;
        --orange-900: #1a0f00;
        --orange-700: #73480b;
        --orange-400: #f29718;
        --orange-500: #d98715;
        --orange-300: #f2a63d;
        --orange-200: #ffc473;
        --orange-100: #ffdaa6;
        --orange-600: #a66710;
        --orange-50: #ffefd9;
        --red-800: #590f00;
        --orange-25: #fffaf2;
        --red-900: #260600;
        --red-700: #8c1700;
        --red-500: #d92d0b;
        --red-400: #f2320c;
        --red-300: #ff6040;
        --red-200: #ff8a73;
        --red-100: #ffb5a6;
        --red-600: #a62308;
        --red-50: #ffdfd9;
        --red-25: #fff4f2;
        --grey-900: #0e0e0e;
        --grey-800: #262626;
        --grey-700: #404040;
        --grey-500: #737373;
        --grey-400: #8c8c8c;
        --grey-300: #a6a6a6;
        --grey-200: #bfbfbf;
        --grey-100: #dadada;
        --grey-600: #595959;
        --grey-50: #e6e6e6;
        --grey-25: #f2f2f2;
        --grey-5: #fafafa;
        --shades-white: #fff;
        --shades-black: #000;
        --purple-700: #120566;
        --purple-900: #03001a;
        --purple-800: #090040;
        --purple-500: #2511a6;
        --purple-400: #2b13bf;
        --purple-600: #19078c;
        --purple-300: #3a21d9;
        --purple-200: #5f4cd9;
        --purple-50: #beb6f2;
        --purple-100: #8c7ee5;
        --purple-25: #f4f2ff;
    }
    .welcome-banner--container {
        clear: both;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 44px;
        margin: 36px 16px 24px 0;
        padding: 24px 48px 36px;
        border-radius: 8px;
        box-shadow: 0 1px 2px 0 rgba(14, 14, 14, 0.15);
        border: solid 1px var(--green-800);
        background-color: var(--shades-white);
        line-height: 1.4;
        color: var(--grey-900);
    }
</style>

<div id="givewpNextGenWelcomeBanner" class="welcome-banner--theme welcome-banner--container">

    <a id="givewpNextGenWelcomeBannerDismiss" href="#" style="position: absolute;top:24px;right:48px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293z" fill="#0E0E0E"/>
        </svg>
    </a>

    <div style="
        display: flex;
        flex-direction: column;
        gap: 44px;
    "
    >
        <header style="display: flex; flex-direction: column; gap: 9px; align-items: start;">
            <div style="
            color: white;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            border-radius: 12px;
            background-color: var(--orange-400);
        ">
                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.209 1.667a.583.583 0 1 0-1.167 0v.875h-.875a.583.583 0 1 0 0 1.167h.875v.875a.583.583 0 1 0 1.167 0v-.875h.875a.583.583 0 1 0 0-1.167h-.875v-.875zM3.209 10.417a.583.583 0 0 0-1.167 0v.875h-.875a.583.583 0 0 0 0 1.167h.875v.875a.583.583 0 1 0 1.167 0v-.875h.875a.583.583 0 0 0 0-1.167h-.875v-.875zM8.128 2.041a.583.583 0 0 0-1.088 0l-1.012 2.63c-.175.456-.23.587-.306.693-.075.107-.168.2-.274.275-.106.075-.238.13-.693.306l-2.63 1.011a.583.583 0 0 0 0 1.09l2.63 1.01c.455.176.587.231.693.306.106.076.199.169.274.275.076.106.13.237.306.693l1.012 2.63a.583.583 0 0 0 1.088 0l1.012-2.63c.175-.456.23-.587.306-.693.075-.106.168-.2.274-.275.106-.075.238-.13.693-.305l2.63-1.012a.583.583 0 0 0 0-1.089l-2.63-1.011c-.455-.176-.587-.23-.693-.306a1.167 1.167 0 0 1-.274-.275c-.076-.106-.13-.237-.306-.693l-1.012-2.63z" fill="#FFFDF2"/>
                </svg>
                <?php _e('Beta', 'give' ); ?>
            </div>
            <h2 style="
            margin: 6px 0 8px;
            font-size: 24px;
            font-weight: bold;
            line-height: 1.33;
        "><?php _e('Welcome aboard! Help us test the new Visual Donation Form Builder', 'give'); ?></h2>
            <div style="font-size: 16px;"><?php _e('Create the donation form of your dreams using an easy-to-use visual donation form builder', 'give'); ?></div>
        </header>


        <div style="
            display: flex;
            flex-wrap: wrap;
            gap: 73px;
        ">
            <!-- Next Steps -->
            <section style="flex:1;">
                <h2 style="
                    font-size: 18px;
                    color: var(--blue-500);
                "><?php _e('Next Steps', 'give'); ?></h2>

                <div style="display:flex;flex-direction:column;gap:73px;">

                    <!-- Join the Journey -->
                    <div>
                        <h3 style="font-size: 16px;"><?php _e('Join the journey', 'give'); ?></h3>
                        <p style="font-size: 12px;"><?php _e('Stay informed about Give 3.0 and Next Gen updates', 'give'); ?></p>
                        <form action="#" style="display: flex;flex-wrap:wrap;gap:8px;">
                            <input
                                style="
                            flex:3;
                            padding: 12px 24px 12px 16px;
                            border-radius: 2px;
                            border: solid 1px var(--grey-300);
                            background-color: var(--shades-white);
                        "
                                type="email"
                                placeholder="<?php esc_attr_e('Enter your email', 'give'); ?>"
                            />
                            <button type="submit" style="
                        flex: 1;
                        font-size: 14px;
                        color: white;
                        padding: 12px 24px;
                        border-radius: 2px;
                        border: solid 1px var(--green-500);
                        background-color: var(--green-500);
                    "><?php _e('Submit', 'give'); ?></button>
                        </form>
                    </div>

                    <!-- Create your new donation form -->
                    <div>
                        <h3><?php _e('Create your new donation form', 'give'); ?></h3>
                        <p><?php _e('The Visual donation form building experience is one click away', 'give'); ?></p>
                        <a
                            href="<?php echo admin_url('edit.php?post_type=give_forms&page=form-builder-next-gen'); ?>"
                            style="
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 24px 12px 16px;
                        border-radius: 4px;
                        border: solid 1px var(--green-600);
                        background-color: var(--shades-white);
                        text-decoration: none;
                        color: var(--green-600);
                    "
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 4.166v11.667M4.165 9.999h11.667" stroke="#2D802F" stroke-width="1.667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <?php _e('Create a next visual donation form', 'give'); ?>
                        </a>
                        <div style="
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: flex-start;
                    gap: 8px;
                    margin: 12px 0 4px 0;
                    padding: 8px 8px 8px 32px;
                    border-radius: 4px;
                    background-color: var(--green-25);
                    color: var(--green-600);
                ">
                            <svg style="margin-top: 2px;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 .666a7.333 7.333 0 1 0 0 14.667A7.333 7.333 0 0 0 8 .666zm0 4a.667.667 0 1 0 0 1.333h.006a.667.667 0 0 0 0-1.333h-.007zm.666 3.333a.667.667 0 0 0-1.333 0v2.667a.667.667 0 1 0 1.333 0V7.999z" fill="#2D802F"/>
                            </svg>
                            <div style="flex:1;">
                                <?php _e('The Next Gen plugin is intended only for testing and feedback purposes. Please do not use for live donations.', 'give'); ?>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <!-- What's New -->
            <section style="flex:2;">
                <h2 style="
                    font-size: 18px;
                    color: var(--blue-500);
                "><?php _e('What\'s New', 'give'); ?></h2>

                <div style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 22px;
                "
                >
                    <!-- Design Mode -->
                    <div style="
                        flex: 1;
                        width: 318px;
                        padding: 12px 12px 16px;
                        border-radius: 4px;
                        border: solid 1px var(--blue-500);
                        background-color: var(--blue-25);
                    ">
                        <img style="width: 100%;" src="https://placehold.co/450x400?text=Design+Mode" alt="">
                        <h3><?php _e('Design mode', 'give'); ?></h3>
                        <div><?php _e('Toggle the "Design" tab and customize the colors and features of your form based on the Form Design you choose.', 'give'); ?></div>
                    </div>

                    <!-- Custom field support -->
                    <div style="
                        flex: 1;
                        width: 318px;
                        padding: 12px 12px 16px;
                        border-radius: 4px;
                        border: solid 1px var(--blue-500);
                        background-color: var(--blue-25);
                    ">
                        <img style="width: 100%;" src="https://placehold.co/450x400?text=Custom+Fields" alt="">
                        <h3><?php _e('Custom field support', 'give'); ?></h3>
                        <div><?php _e('Add custom fields to your form. Drag and drop them where you need, to any section. Even add new drag-and-droppable sections!', 'give'); ?></div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>

<script>
    jQuery('#givewpNextGenWelcomeBannerDismiss').click(function() {
        jQuery.post(ajaxurl, {
            'action': '<?php echo $action; ?>',
            'nonce': '<?php echo $nonce; ?>',
        }, function(response) {
            jQuery('#givewpNextGenWelcomeBanner').slideUp("slow");
        });
    });
</script>
